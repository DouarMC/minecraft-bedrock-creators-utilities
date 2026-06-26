import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { DynamicExamplesSourceKey } from "../../../minecraftSchemas/shared/schemaEnums";
import { MinecraftFileResolverService } from "../../services/minecraft/MinecraftFileResolverService";
import { MinecraftGame } from "../minecraft/models/games/MinecraftGame";
import { MinecraftGameManager } from "../../services/minecraft/MinecraftGameManager";
import { MinecraftProject } from "../minecraft/models/projects/MinecraftProject";
import { MinecraftProjectManager } from "../../services/projects/MinecraftProjectManager";
import { MinecraftFileId } from "../minecraft/fileTypes/MinecraftFileId";
import { ExtensionConfig } from "../ExtensionConfig";
import { VersionResolver } from "../minecraft/versioning/VersionResolver";

export class DynamicSourceHandlers {
    public static async getDynamicExampleSourceValues(key: DynamicExamplesSourceKey | DynamicExamplesSourceKey[] | Object): Promise<string[]> {
        const exampleValues: string[] = [];
        const minecraftProject = MinecraftProjectManager.project;
        const minecraftGame = minecraftProject
            ? MinecraftGameManager.getMinecraftGameForProject(minecraftProject)
            : undefined;
        const fileSourcesAvailable: (MinecraftGame | MinecraftProject)[] = [];
        if (minecraftGame) {
            fileSourcesAvailable.push(minecraftGame);
        }
        if (minecraftProject) {
            fileSourcesAvailable.push(minecraftProject);
        }

        if (typeof key === "string" || Array.isArray(key)) {
            const keys = typeof key === "string" ? [key] : key;
            for (const key of keys) {
                switch (key as DynamicExamplesSourceKey) {
                    case "aim_assist_category_ids":
                        exampleValues.push(...await this.getAimAssistCategoryIds(fileSourcesAvailable));
                        break;
                    case "aim_assist_preset_ids":
                        exampleValues.push(...await this.getAimAssistPresetIds(fileSourcesAvailable));
                        break;
                    case "atmosphere_settings_ids":
                        exampleValues.push(...await this.getAtmosphereSettingsIds(fileSourcesAvailable));
                        break;
                    case "behavior_animation_controller_ids":
                        exampleValues.push(...await this.getBehaviorAnimationControllerIds(fileSourcesAvailable));
                        break;
                    case "behavior_animation_ids":
                        exampleValues.push(...await this.getBehaviorAnimationIds(fileSourcesAvailable));
                        break;
                    case "biome_ids":
                        exampleValues.push(...await this.getBiomeIds(fileSourcesAvailable));
                        break;
                    case "biome_tags":
                        exampleValues.push(...await this.getBiomeTags(fileSourcesAvailable));
                        break;
                    case "block_culling_rules_ids":
                        exampleValues.push(...await this.getBlockCullingRulesIds(fileSourcesAvailable));
                        break;
                    case "block_ids":
                        exampleValues.push(...await this.getBlockIds(fileSourcesAvailable));
                        break;
                    case "block_sound_references":
                        exampleValues.push(...await this.getBlockSoundReferences(fileSourcesAvailable));
                        break;
                    case "block_tags":
                        exampleValues.push(...await this.getBlockTags(fileSourcesAvailable));
                        break;
                    case "block_texture_references":
                        exampleValues.push(...await this.getBlockTextureReferences(fileSourcesAvailable));
                        break;
                    case "camera_preset_ids":
                        exampleValues.push(...await this.getCameraPresetIds(fileSourcesAvailable));
                        break;
                    case "color_grading_settings_ids":
                        exampleValues.push(...await this.getColorGradingSettingsIds(fileSourcesAvailable));
                        break;
                    case "cooldown_category_ids":
                        exampleValues.push(...await this.getCooldownCategoryIds(fileSourcesAvailable));
                        break;
                    case "crafting_recipe_tags":
                        exampleValues.push(...await this.getCraftingRecipeTags(fileSourcesAvailable));
                        break;
                    case "culling_layer_ids":
                        exampleValues.push(...await this.getCullingLayerIds(fileSourcesAvailable));
                        break;
                    case "cubemap_settings_ids":
                        exampleValues.push(...await this.getCubemapSettingsIds(fileSourcesAvailable));
                        break;
                    case "data_driven_aim_assist_category_ids":
                        exampleValues.push(...await this.getAimAssistCategoryIds(fileSourcesAvailable.filter(source => source instanceof MinecraftProject)));
                        break;
                    case "data_driven_aim_assist_preset_ids":
                        exampleValues.push(...await this.getAimAssistPresetIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_atmosphere_settings_ids":
                        exampleValues.push(...await this.getAtmosphereSettingsIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_attachable_ids":
                        exampleValues.push(...await this.getAttachableIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_base_block_sound_references":
                        exampleValues.push(...await this.getBaseBlockSoundReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_biome_ids":
                        exampleValues.push(...await this.getBiomeIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_block_texture_references":
                        exampleValues.push(...await this.getBlockTextureReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_camera_preset_ids":
                        exampleValues.push(...await this.getCameraPresetIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_color_grading_settings_ids":
                        exampleValues.push(...await this.getColorGradingSettingsIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_dimension_ids":
                        exampleValues.push(...await this.getDimensionIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_entity_ids":
                        exampleValues.push(...await this.getEntityIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_feature_ids":
                        exampleValues.push(...await this.getFeatureIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_feature_rules_ids":
                        exampleValues.push(...await this.getFeatureRulesIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_fog_ids":
                        exampleValues.push(...await this.getFogIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_individual_event_sound_references":
                        exampleValues.push(...await this.getIndividualEventSoundReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_individual_named_sound_references":
                        exampleValues.push(...await this.getIndividualNamedSoundReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_interactive_block_sound_references":
                        exampleValues.push(...await this.getInteractiveBlockSoundReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_item_ids":
                        exampleValues.push(...await this.getDataDrivenItemIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_item_texture_references":
                        exampleValues.push(...await this.getItemTextureReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_jigsaw_structure_ids":
                        exampleValues.push(...await this.getJigsawStructureIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_language_ids":
                        exampleValues.push(...await this.getLanguageIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_lighting_settings_ids":
                        exampleValues.push(...await this.getLightingSettingsIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_model_ids":
                        exampleValues.push(...await this.getModelIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_music_references":
                        exampleValues.push(...await this.getMusicReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_particle_effect_ids":
                        exampleValues.push(...await this.getParticleEffectIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_processor_ids":
                        exampleValues.push(...await this.getProcessorIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_recipe_ids":
                        exampleValues.push(...await this.getRecipeIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_render_controller_ids":
                        exampleValues.push(...await this.getRenderControllerIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_resource_animation_controller_ids":
                        exampleValues.push(...await this.getResourceAnimationControllerIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_resource_animation_ids":
                        exampleValues.push(...await this.getResourceAnimationIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_sound_references":
                        exampleValues.push(...await this.getSoundReferences(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_spawn_rules_ids":
                        exampleValues.push(...await this.getSpawnRulesIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_structure_set_ids":
                        exampleValues.push(...await this.getStructureSetIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_template_pool_ids":
                        exampleValues.push(...await this.getTemplatePoolIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "data_driven_water_settings_ids":
                        exampleValues.push(...await this.getWaterSettingsIds(fileSourcesAvailable.filter(source => source instanceof MinecraftGame)));
                        break;
                    case "effect_ids":
                        exampleValues.push(...await this.getEffectIds(fileSourcesAvailable));
                        break;
                    case "entity_family_ids":
                        exampleValues.push(...await this.getEntityFamilyIds(fileSourcesAvailable));
                        break;
                    case "entity_ids":
                        exampleValues.push(...await this.getEntityIds(fileSourcesAvailable));
                        break;
                    case "feature_ids":
                        exampleValues.push(...await this.getFeatureIds(fileSourcesAvailable));
                        break;
                    case "fog_ids":
                        exampleValues.push(...await this.getFogIds(fileSourcesAvailable));
                        break;
                    case "inheritable_camera_preset_ids":
                        exampleValues.push(...await this.getCameraPresetIds(fileSourcesAvailable));
                        break;
                    case "item_group_ids":
                        exampleValues.push(...await this.getItemGroupIds(fileSourcesAvailable));
                        break;
                    case "item_ids":
                        exampleValues.push(...await this.getItemIds(fileSourcesAvailable));
                        break;
                    case "item_tags":
                        exampleValues.push(...await this.getItemTags(fileSourcesAvailable));
                        break;
                    case "item_texture_references":
                        exampleValues.push(...await this.getItemTextureReferences(fileSourcesAvailable));
                        break;
                    case "language_ids":
                        exampleValues.push(...await this.getLanguageIds(fileSourcesAvailable));
                        break;
                    case "lighting_settings_ids":
                        exampleValues.push(...await this.getLightingSettingsIds(fileSourcesAvailable));
                        break;
                    case "loot_table_file_paths":
                        exampleValues.push(...await this.getLootTableFilePaths(fileSourcesAvailable));
                        break;
                    case "mcfunction_file_paths_without_extension":
                        exampleValues.push(...await this.getMcfunctionFilePathsWithoutExtension(fileSourcesAvailable));
                        break;
                    case "model_ids":
                        exampleValues.push(...await this.getModelIds(fileSourcesAvailable));
                        break;
                    case "music_references":
                        exampleValues.push(...await this.getMusicReferences(fileSourcesAvailable));
                        break;
                    case "old_format_item_ids":
                        exampleValues.push(...await this.getOldFormatItemIds(fileSourcesAvailable));
                        break;
                    case "particle_effect_ids":
                        exampleValues.push(...await this.getParticleEffectIds(fileSourcesAvailable));
                        break;
                    case "processor_ids":
                        exampleValues.push(...await this.getProcessorIds(fileSourcesAvailable));
                        break;
                    case "project_texture_file_paths":
                        exampleValues.push(...await this.getProjectTextureFilePaths(fileSourcesAvailable));
                        break;
                    case "project_ui_file_paths":
                        exampleValues.push(...await this.getProjectUiFilePaths(fileSourcesAvailable));
                        break;
                    case "render_controller_ids":
                        exampleValues.push(...await this.getRenderControllerIds(fileSourcesAvailable));
                        break;
                    case "resource_animation_controller_ids":
                        exampleValues.push(...await this.getResourceAnimationControllerIds(fileSourcesAvailable));
                        break;
                    case "resource_animation_ids":
                        exampleValues.push(...await this.getResourceAnimationIds(fileSourcesAvailable));
                        break;
                    case "sound_file_paths_without_extension":
                        exampleValues.push(...await this.getSoundFilePathsWithoutExtension(fileSourcesAvailable));
                        break;
                    case "sound_references":
                        exampleValues.push(...await this.getSoundReferences(fileSourcesAvailable));
                        break;
                    case "template_pool_ids":
                        exampleValues.push(...await this.getTemplatePoolIds(fileSourcesAvailable));
                        break;
                    case "texture_file_paths":
                        exampleValues.push(...await this.getTextureFilePaths(fileSourcesAvailable));
                        break;
                    case "trading_file_paths":
                        exampleValues.push(...await this.getTradingFilePaths(fileSourcesAvailable));
                        break;
                    case "vanilla_biome_ids_without_namespace":
                        exampleValues.push(...await this.getVanillaBiomeIdsWithoutNamespace(fileSourcesAvailable));
                        break;
                    case "vanilla_block_ids_without_namespace":
                        exampleValues.push(...await this.getVanillaBlockIdsWithoutNamespace(fileSourcesAvailable));
                        break;
                    case "vanilla_enchantment_ids":
                        exampleValues.push(...await this.getEnchantmentIds(fileSourcesAvailable));
                        break;
                    case "vanilla_entity_ids_without_namespace":
                        exampleValues.push(...await this.getVanillaEntityIdsWithoutNamespace(fileSourcesAvailable));
                        break;
                    case "vanilla_item_group_ids_without_namespace":
                        exampleValues.push(...await this.getVanillaItemGroupIdsWithoutNamespace(fileSourcesAvailable));
                        break;
                    case "vanilla_ui_global_variables":
                        exampleValues.push(...await this.getVanillaUiGlobalVariables(fileSourcesAvailable));
                        break;
                    case "voxel_shape_ids":
                        exampleValues.push(...await this.getVoxelShapeIds(fileSourcesAvailable));
                    case "water_settings_ids":
                        exampleValues.push(...await this.getWaterSettingsIds(fileSourcesAvailable));
                        break;
                    case "data_driven_block_entity_ids":
                        exampleValues.push(...await this.getDataDrivenBlockEntityIds(fileSourcesAvailable));
                        break;
                }
            }

        } else {

        }

        return Array.from(new Set(exampleValues));
    }

    private static async getVanillaIdentifiersDist(): Promise<any> {
        const vanillaDistFile = await fetch(ExtensionConfig.SCHEMA_BASE_URL + "minecraftVanillaIdentifiers/stable.json");
        if (! vanillaDistFile.ok) {
            throw new Error(`Failed to fetch vanilla identifiers distribution: ${vanillaDistFile.statusText}`);
        }

        return await vanillaDistFile.json();
    }

    private static async getFileContent(file: vscode.Uri): Promise<any> {
        const fileData = await vscode.workspace.fs.readFile(file);
        const fileContent = new TextDecoder("utf-8").decode(fileData);
        return JsonParser.parse(fileContent);
    }

    private static async getDataDrivenFilesFromSources(minecraftFileId: MinecraftFileId, fileSources: (MinecraftGame | MinecraftProject)[]): Promise<vscode.Uri[]> {
        const files: vscode.Uri[] = [];
        for (const fileSource of fileSources) {
            const resolvedFiles = await MinecraftFileResolverService.getDataDrivenFiles(minecraftFileId, fileSource);
            files.push(...resolvedFiles);
        }

        return files;
    }

    private static async getAimAssistCategoryIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const aimAssistCategories: string[] = [];

        const files= await this.getDataDrivenFilesFromSources("behavior_pack/aim_assist/categories/categories.json", fileSources);

        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const categories = json?.["minecraft:aim_assist_categories"]?.categories;
                if (Array.isArray(categories)) {
                    for (const category of categories) {
                        const id = category?.name;
                        if (typeof id === "string") {
                            aimAssistCategories.push(id);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse aim_assist categories from ${file.toString()}:`, error);
            }
        }

        return aimAssistCategories;
    }

    private static async getAimAssistPresetIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const aimAssistPresets: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/aim_assist/presets/<all>.json", fileSources);

        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:aim_assist_preset"]?.identifier;
                if (typeof id === "string") {
                    aimAssistPresets.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse aim_assist preset from ${file.toString()}:`, error);
            }
        }

        return aimAssistPresets;
    }

    private static async getAtmosphereSettingsIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const atmosphereSettingsIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/atmospherics/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:atmosphere_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    atmosphereSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse atmosphere settings from ${file.toString()}:`, error);
            }
        }

        return atmosphereSettingsIds;
    }

    private static async getAttachableIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const attachableIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/attachables/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:attachable"]?.description?.identifier;
                if (typeof id === "string") {
                    attachableIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse attachable from ${file.toString()}:`, error);
            }
        }

        return attachableIds;
    }

    private static async getBaseBlockSoundReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const baseBlockSoundReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const blockSoundsProperty = json?.["block_sounds"];
                if (typeof blockSoundsProperty === "object") {
                    for (const key of Object.keys(blockSoundsProperty)) {
                        if (typeof blockSoundsProperty[key] === "object") {
                            baseBlockSoundReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse base block sound references from ${file.toString()}:`, error);
            }
        }

        return baseBlockSoundReferences;
    }

    private static async getBehaviorAnimationControllerIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const behaviorAnimationControllerIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/animation_controllers/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const animationControllers = json?.animation_controllers;
                if (typeof animationControllers === "object") {
                    for (const key of Object.keys(animationControllers)) {
                        if (typeof animationControllers[key] === "object") {
                            behaviorAnimationControllerIds.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse behavior animation controller from ${file.toString()}:`, error);
            }
        }

        return behaviorAnimationControllerIds;
    }

    private static async getBehaviorAnimationIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const behaviorAnimationIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/animations/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const animations = json?.animations;
                if (typeof animations === "object") {
                    for (const key of Object.keys(animations)) {
                        if (typeof animations[key] === "object") {
                            behaviorAnimationIds.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse behavior animation from ${file.toString()}:`, error);
            }
        }

        return behaviorAnimationIds;
    }

    private static async getBiomeIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const biomeIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/biomes/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:biome"]?.description?.identifier;
                if (typeof id === "string") {
                    biomeIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse biome from ${file.toString()}:`, error);
            }
        }

        return biomeIds;
    }

    private static async getBiomeTags(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const biomeTags: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/biomes/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const tags = json?.["minecraft:biome"]?.components?.["minecraft:tags"]?.tags;
                if (Array.isArray(tags)) {
                    for (const tag of tags) {
                        if (typeof tag === "string") {
                            biomeTags.push(tag);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse biome tags from ${file.toString()}:`, error);
            }
        }

        return biomeTags;
    }

    private static async getBlockCullingRulesIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const blockCullingRulesIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/block_culling/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:block_culling_rules"]?.description?.identifier;
                if (typeof id === "string") {
                    blockCullingRulesIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse block culling rules from ${file.toString()}:`, error);
            }
        }

        return blockCullingRulesIds;
    }

    private static async getBlockIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const blockIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_BLOCK_IDS];
        const files = await this.getDataDrivenFilesFromSources("behavior_pack/blocks/<all>.json", fileSources);

        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:block"]?.description?.identifier;
                if (typeof id === "string") {
                    blockIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse block from ${file.toString()}:`, error);
            }
        }

        return blockIds;
    }

    private static async getBlockSoundReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const blockSoundReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const blockSoundsProperty = json?.["block_sounds"];
                if (typeof blockSoundsProperty === "object") {
                    for (const key of Object.keys(blockSoundsProperty)) {
                        if (typeof blockSoundsProperty[key] === "object") {
                            blockSoundReferences.push(key);
                        }
                    }
                }

                const interactiveBlockSoundsProperty = json?.["interactive_sounds"]?.block_sounds;
                if (typeof interactiveBlockSoundsProperty === "object") {
                    for (const key of Object.keys(interactiveBlockSoundsProperty)) {
                        if (typeof interactiveBlockSoundsProperty[key] === "object") {
                            blockSoundReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse block sound references from ${file.toString()}:`, error);
            }
        }

        return blockSoundReferences;
    }

    private static async getBlockTextureReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const blockTextureReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/textures/terrain_texture.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const textureDataProperty = json?.texture_data;
                if (typeof textureDataProperty === "object") {
                    for (const key of Object.keys(textureDataProperty)) {
                        if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                            blockTextureReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse block texture references from ${file.toString()}:`, error);
            }
        }

        return blockTextureReferences;
    }

    private static async getCameraPresetIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const cameraPresetIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/cameras/presets/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:camera_preset"]?.identifier;
                if (typeof id === "string") {
                    cameraPresetIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse camera preset from ${file.toString()}:`, error);
            }
        }

        return cameraPresetIds;
    }

    private static async getColorGradingSettingsIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const colorGradingSettingsIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/color_grading/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:color_grading_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    colorGradingSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse color grading settings from ${file.toString()}:`, error);
            }
        }

        return colorGradingSettingsIds;
    }

    private static async getCooldownCategoryIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const cooldownCategoryIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_COOLDOWN_CATEGORY_IDS];

        const itemsFiles = await this.getDataDrivenFilesFromSources("behavior_pack/items/<all>.json", fileSources);
        for (const file of itemsFiles) {
            try {
                const json = await this.getFileContent(file);
                const cooldownCategory = json?.["minecraft:item"]?.components?.["minecraft:cooldown"]?.category;
                if (typeof cooldownCategory === "string") {
                    cooldownCategoryIds.push(cooldownCategory);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse cooldown category from ${file.toString()}:`, error);
            }
        }

        return cooldownCategoryIds;
    }

    private static async getCraftingRecipeTags(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const craftingRecipeTags: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/recipes/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const minecraftRecipeShapeless = json?.["minecraft:recipe_shapeless"];
                const minecraftRecipeShaped = json?.["minecraft:recipe_shaped"];
                if (minecraftRecipeShapeless && Array.isArray(minecraftRecipeShapeless.tags)) {
                    for (const tag of minecraftRecipeShapeless.tags) {
                        if (typeof tag === "string") {
                            craftingRecipeTags.push(tag);
                        }
                    }
                }
                if (minecraftRecipeShaped && Array.isArray(minecraftRecipeShaped.tags)) {
                    for (const tag of minecraftRecipeShaped.tags) {
                        if (typeof tag === "string") {
                            craftingRecipeTags.push(tag);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse crafting recipe tags from ${file.toString()}:`, error);
            }
        }

        return craftingRecipeTags;
    }

    private static async getCullingLayerIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const cullingLayerIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_CULLING_LAYER_IDS];

        const blocksFiles = await this.getDataDrivenFilesFromSources("behavior_pack/blocks/<all>.json", fileSources);
        for (const file of blocksFiles) {
            try {
                const json = await this.getFileContent(file);
                const cullingLayer = json?.["minecraft:block"]?.components?.["minecraft:geometry"]?.culling_layer;
                if (typeof cullingLayer === "string") {
                    cullingLayerIds.push(cullingLayer);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse culling layer from ${file.toString()}:`, error);
            }
        }

        return cullingLayerIds;
    }

    private static async getDataDrivenItemIds(fileSources: (MinecraftGame | MinecraftProject)[], ): Promise<string[]> {
        const itemsIds: string[] = [];
        const files = await this.getDataDrivenFilesFromSources("behavior_pack/items/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:item"]?.description?.identifier;
                if (typeof id === "string") {
                    itemsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item from ${file.toString()}:`, error);
            }
        }

        return itemsIds;
    }

    private static async getDimensionIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const dimensionIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_DIMENSION_IDS];

        return dimensionIds;
    }

    private static async getEffectIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const effectIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_EFFECT_IDS];

        return effectIds;
    }

    private static async getEnchantmentIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const enchantmentIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_ENCHANTMENT_IDS];

        return enchantmentIds;
    }

    private static async getEntityFamilyIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const entityFamilyIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/entities/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const families = json?.["minecraft:entity"]?.components?.["minecraft:type_family"]?.family;
                if (Array.isArray(families)) {
                    for (const family of families) {
                        if (typeof family === "string") {
                            entityFamilyIds.push(family);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse entity family from ${file.toString()}:`, error);
            }
        }

        return entityFamilyIds;
    }

    private static async getEntityIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const entityIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_ENTITY_IDS];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/entities/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);

                const id = json?.["minecraft:entity"]?.description?.identifier;
                if (typeof id === "string") {
                    entityIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse entity from ${file.toString()}:`, error);
            }
        }

        return entityIds;
    }

    private static async getFeatureIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const featureIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/features/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);

                const featureTypes = [
                    "minecraft:aggregate_feature",
                    "minecraft:cave_carver_feature",
                    "minecraft:fossil_feature",
                    "minecraft:geode_feature",
                    "minecraft:growing_plant_feature",
                    "minecraft:multiface_feature",
                    "minecraft:nether_cave_carver_feature",
                    "minecraft:ore_feature",
                    "minecraft:partially_exposed_blob_feature",
                    "minecraft:scatter_feature",
                    "minecraft:sequence_feature",
                    "minecraft:single_block_feature",
                    "minecraft:snap_to_surface_feature",
                    "minecraft:structure_template_feature",
                    "minecraft:surface_relative_threshold_feature",
                    "minecraft:tree_feature",
                    "minecraft:underwater_cave_carver_feature",
                    "minecraft:vegetation_patch_feature",
                    "minecraft:weighted_random_feature"
                ];

                for (const featureType of featureTypes) {
                    const feature = json?.[featureType];
                    if (feature && typeof feature === "object") {
                        const id = feature.description?.identifier;
                        if (typeof id === "string") {
                            featureIds.push(id);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse feature from ${file.toString()}:`, error);
            }
        }

        return featureIds;
    }

    private static async getFeatureRulesIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const featureRulesIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/feature_rules/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:feature_rules"]?.description?.identifier;
                if (typeof id === "string") {
                    featureRulesIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse feature rules from ${file.toString()}:`, error);
            }
        }

        return featureRulesIds;
    }

    private static async getFogIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const fogIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/fogs/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:fog_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    fogIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse fog settings from ${file.toString()}:`, error);
            }
        }

        return fogIds;
    }

    private static async getIndividualEventSoundReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const individualEventSoundReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const individualEventSoundsProperty = json?.individual_event_sounds?.events;
                if (typeof individualEventSoundsProperty === "object") {
                    for (const key of Object.keys(individualEventSoundsProperty)) {
                        if (typeof individualEventSoundsProperty[key] === "object") {
                            individualEventSoundReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse individual event sound references from ${file.toString()}:`, error);
            }
        }

        return individualEventSoundReferences;
    }

    private static async getIndividualNamedSoundReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const individualNamedSoundReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const individualNamedSoundsProperty = json?.individual_named_sounds?.sounds;
                if (typeof individualNamedSoundsProperty === "object") {
                    for (const key of Object.keys(individualNamedSoundsProperty)) {
                        if (typeof individualNamedSoundsProperty[key] === "object") {
                            individualNamedSoundReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse individual named sound references from ${file.toString()}:`, error);
            }
        }

        return individualNamedSoundReferences;
    }

    private static async getInteractiveBlockSoundReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const interactiveBlockSoundReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const interactiveBlockSoundsProperty = json?.["interactive_sounds"]?.block_sounds;
                if (typeof interactiveBlockSoundsProperty === "object") {
                    for (const key of Object.keys(interactiveBlockSoundsProperty)) {
                        if (typeof interactiveBlockSoundsProperty[key] === "object") {
                            interactiveBlockSoundReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse interactive block sound references from ${file.toString()}:`, error);
            }
        }

        return interactiveBlockSoundReferences;
    }

    private static async getItemIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const itemIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_ITEM_IDS];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/items/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:item"]?.description?.identifier;
                if (typeof id === "string") {
                    itemIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item from ${file.toString()}:`, error);
            }
        }

        return itemIds;
    }

    private static async getItemGroupIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const itemGroupIds: string[] = [];
        const craftingItemCatalogFiles = await this.getDataDrivenFilesFromSources("behavior_pack/item_catalog/crafting_item_catalog.json", fileSources);

        for (const file of craftingItemCatalogFiles) {
            try {
                const json = await this.getFileContent(file);
                const categoriesProperty = json?.["minecraft:crafting_items_catalog"]?.categories;
                if (Array.isArray(categoriesProperty)) {
                    for (const category of categoriesProperty) {
                        const groupsProperty = category?.groups;
                        if (Array.isArray(groupsProperty)) {
                            for (const group of groupsProperty) {
                                const nameProperty = group?.group_identifier?.name;
                                if (typeof nameProperty === "string") {
                                    itemGroupIds.push(nameProperty);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item group from ${file.toString()}:`, error);
            }
        }

        const blockFiles = await this.getDataDrivenFilesFromSources("behavior_pack/blocks/<all>.json", fileSources);
        for (const file of blockFiles) {
            try {
                const json = await this.getFileContent(file);
                const itemGroupProperty = json?.["minecraft:block"]?.description?.menu_category?.group;
                if (typeof itemGroupProperty === "string") {
                    itemGroupIds.push(itemGroupProperty);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item group from ${file.toString()}:`, error);
            }
        }

        const itemFiles = await this.getDataDrivenFilesFromSources("behavior_pack/items/<all>.json", fileSources);
        for (const file of itemFiles) {
            try {
                const json = await this.getFileContent(file);
                const itemGroupProperty = json?.["minecraft:item"]?.description?.menu_category?.group;
                if (typeof itemGroupProperty === "string") {
                    itemGroupIds.push(itemGroupProperty);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item group from ${file.toString()}:`, error);
            }
        }

        return itemGroupIds;
    }

    private static async getItemTags(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const itemTags: string[] = (await this.getVanillaIdentifiersDist()).VANILLA_ITEM_TAGS;

        return itemTags;
    }

    private static async getItemTextureReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const itemTextureReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/textures/item_texture.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const textureDataProperty = json?.texture_data;
                if (typeof textureDataProperty === "object") {
                    for (const key of Object.keys(textureDataProperty)) {
                        if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                            itemTextureReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item texture references from ${file.toString()}:`, error);
            }
        }

        return itemTextureReferences;
    }

    private static async getJigsawStructureIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const jigsawStructureIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/worldgen/structures/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:jigsaw_structure"]?.description?.identifier;
                if (typeof id === "string") {
                    jigsawStructureIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse jigsaw structure from ${file.toString()}:`, error);
            }
        }

        return jigsawStructureIds;
    }

    private static async getLanguageIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const languageIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/texts/languages.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                if (Array.isArray(json)) {
                    for (const langEntry of json) {
                        if (typeof langEntry === "string") {
                            languageIds.push(langEntry);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse language IDs from ${file.toString()}:`, error);
            }
        }

        return languageIds;
    }

    private static async getLightingSettingsIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const lightingSettingsIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/lighting/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:lighting_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    lightingSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse lighting settings from ${file.toString()}:`, error);
            }
        }

        return lightingSettingsIds;
    }

    private static async getLootTableFilePaths(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getLootTableRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](loot_tables[\/\\].+\.json)$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const lootTableFilePaths: string[] = [];
        const files = await this.getDataDrivenFilesFromSources("behavior_pack/loot_tables/<all>.json", fileSources);
        for (const file of files) {
            const relativePath = getLootTableRelativePath(file);
            if (relativePath) {
                lootTableFilePaths.push(relativePath);
            }
        }

        return lootTableFilePaths;
    }

    private static async getMcfunctionFilePathsWithoutExtension(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getMcfunctionRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](functions[\/\\].+)\.mcfunction$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const mcfunctionFilePaths: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/functions/<all>.mcfunction", fileSources);
        for (const file of files) {
            const relativePath = getMcfunctionRelativePath(file);
            if (relativePath) {
                mcfunctionFilePaths.push(relativePath);
            }
        }

        return mcfunctionFilePaths;
    }

    private static async getModelIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const modelIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_MODEL_IDS];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/models/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const formatVersion = json?.format_version;
                if (typeof formatVersion !== "string") continue;

                if (VersionResolver.compare(formatVersion, "1.8.0") >= 0 && VersionResolver.compare(formatVersion, "1.12.0") < 0) {
                    const keys = Object.keys(json);
                    for (const key of keys) {
                        if (key.startsWith("geometry.") && typeof json[key] === "object") {
                            modelIds.push(key);
                        }
                    }
                } else if (VersionResolver.compare(formatVersion, "1.12.0") >= 0) {
                    const minecraftGeometry = json?.["minecraft:geometry"];
                    if (Array.isArray(minecraftGeometry)) {
                        for (const geometryEntry of minecraftGeometry) {
                            const identifier = geometryEntry?.description?.identifier;
                            if (typeof identifier === "string") {
                                modelIds.push(identifier);
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse model from ${file.toString()}:`, error);
            }
        }

        return modelIds;
    }

    private static async getMusicReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const musicReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds/music_definitions.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const keys = Object.keys(json);
                for (const key of keys) {
                    if (typeof json[key] !== "object") continue;
                    const eventName = json[key]?.event_name;
                    if (typeof eventName === "string") {
                        musicReferences.push(eventName);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse music references from ${file.toString()}:`, error);
            }
        }

        return musicReferences;
    }

    private static async getOldFormatItemIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const itemIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/items/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:item"]?.description?.identifier;
                if (typeof id === "string") {
                    const formatVersion = json?.format_version;
                    if (typeof formatVersion !== "string") continue;
                    if (VersionResolver.compare(formatVersion, "1.16.100") >= 0) {
                        if (itemIds.includes(id)) {
                            itemIds.splice(itemIds.indexOf(id), 1);
                        }
                        continue;
                    }

                    itemIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse item from ${file.toString()}:`, error);
            }
        }

        return itemIds;
    }

    private static async getParticleEffectIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const particleEffectIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/particles/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["particle_effect"]?.description?.identifier;
                if (typeof id === "string") {
                    particleEffectIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse particle effect from ${file.toString()}:`, error);
            }
        }

        return particleEffectIds;
    }

    private static async getProjectTextureFilePaths(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const textureFilePaths: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/textures/*.{tga,png,jpg,jpeg}", fileSources);
        for (const file of files) {
            const relativePath = getTextureRelativePath(file);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        return textureFilePaths;
    }

    private static async getProjectUiFilePaths(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getUiRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](ui[\/\\].+\.json)$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const uiFilePaths: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/ui/<all>.json", fileSources);
        for (const file of files) {
            const relativePath = getUiRelativePath(file);
            if (relativePath) {
                uiFilePaths.push(relativePath);
            }
        }

        return uiFilePaths;
    }

    private static async getProcessorIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const processorIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/worldgen/processors/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:processor_list"]?.description?.identifier;
                if (typeof id === "string") {
                    processorIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse processor from ${file.toString()}:`, error);
            }
        }

        return processorIds;
    }

    private static async getRecipeIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const recipeIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/recipes/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const recipeFurnace = json?.["minecraft:recipe_furnace"];
                const recipeBrewingContainer = json?.["minecraft:recipe_brewing_container"];
                const recipeBrewingMix = json?.["minecraft:recipe_brewing_mix"];
                const recipeShaped = json?.["minecraft:recipe_shaped"];
                const recipeShapeless = json?.["minecraft:recipe_shapeless"];
                const recipeSmithingTransform = json?.["minecraft:recipe_smithing_transform"];
                const recipeSmithingTrim = json?.["minecraft:recipe_smithing_trim"];

                if (recipeFurnace && typeof recipeFurnace === "object") {
                    const id = recipeFurnace.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
                if (recipeBrewingContainer && typeof recipeBrewingContainer === "object") {
                    const id = recipeBrewingContainer.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
                if (recipeBrewingMix && typeof recipeBrewingMix === "object") {
                    const id = recipeBrewingMix.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
                if (recipeShaped && typeof recipeShaped === "object") {
                    const id = recipeShaped.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
                if (recipeShapeless && typeof recipeShapeless === "object") {
                    const id = recipeShapeless.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
                if (recipeSmithingTransform && typeof recipeSmithingTransform === "object") {
                    const id = recipeSmithingTransform.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
                if (recipeSmithingTrim && typeof recipeSmithingTrim === "object") {
                    const id = recipeSmithingTrim.description?.identifier;
                    if (typeof id === "string") {
                        recipeIds.push(id);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse recipe from ${file.toString()}:`, error);
            }
        }

        return recipeIds;
    }

    private static async getRenderControllerIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const renderControllerIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/render_controllers/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const renderControllers = json?.render_controllers;
                if (typeof renderControllers === "object") {
                    for (const key of Object.keys(renderControllers)) {
                        if (typeof renderControllers[key] === "object") {
                            renderControllerIds.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse render controller from ${file.toString()}:`, error);
            }
        }

        return renderControllerIds;
    }

    private static async getResourceAnimationControllerIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const resourceAnimationControllerIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/animation_controllers/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const animationControllers = json?.animation_controllers;
                if (typeof animationControllers === "object") {
                    for (const key of Object.keys(animationControllers)) {
                        if (typeof animationControllers[key] === "object") {
                            resourceAnimationControllerIds.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse resource animation controller from ${file.toString()}:`, error);
            }
        }

        return resourceAnimationControllerIds;
    }

    private static async getResourceAnimationIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const resourceAnimationIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/animations/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const animations = json?.animations;
                if (typeof animations === "object") {
                    for (const key of Object.keys(animations)) {
                        if (typeof animations[key] === "object") {
                            resourceAnimationIds.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse resource animation from ${file.toString()}:`, error);
            }
        }

        return resourceAnimationIds;
    }

    private static async getSoundFilePathsWithoutExtension(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getSoundRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](sounds[\/\\].+?)(?:\.(ogg|wav|mp3|fsb))?$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const soundFilePaths: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds/*.{wav,mp3,ogg,fsb}", fileSources);
        for (const file of files) {
            const relativePath = getSoundRelativePath(file);
            if (relativePath) {
                soundFilePaths.push(relativePath);
            }
        }

        return soundFilePaths;
    }

    private static async getSoundReferences(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const soundReferences: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/sounds/sound_definitions.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const soundDefinitionsProperty = json?.sound_definitions;
                if (typeof soundDefinitionsProperty === "object") {
                    for (const key of Object.keys(soundDefinitionsProperty)) {
                        if (typeof soundDefinitionsProperty[key] === "object") {
                            soundReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse sound references from ${file.toString()}:`, error);
            }
        }

        return soundReferences;
    }

    private static async getSpawnRulesIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const spawnRuleIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/spawn_rules/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:spawn_rules"]?.description?.identifier;
                if (typeof id === "string") {
                    spawnRuleIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse spawn rules from ${file.toString()}:`, error);
            }
        }

        return spawnRuleIds;
    }

    private static async getStructureSetIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const structureSetIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/worldgen/structure_sets/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:structure_set"]?.description?.identifier;
                if (typeof id === "string") {
                    structureSetIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse structure set from ${file.toString()}:`, error);
            }
        }

        return structureSetIds;
    }

    private static async getTemplatePoolIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const templatePoolIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("behavior_pack/worldgen/template_pools/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:template_pool"]?.description?.identifier;
                if (typeof id === "string") {
                    templatePoolIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse template pool from ${file.toString()}:`, error);
            }
        }

        return templatePoolIds;
    }

    private static async getTextureFilePaths(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const textureFilePaths: string[] = [];
        const files = await this.getDataDrivenFilesFromSources("resource_pack/textures/*.{tga,png,jpg,jpeg}", fileSources);
        for (const file of files) {
            const relativePath = getTextureRelativePath(file);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        return textureFilePaths;
    }

    private static async getTradingFilePaths(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        function getTradingRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](trading[\/\\].+\.json)$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const tradingFilePaths: string[] = [];
        const files = await this.getDataDrivenFilesFromSources("behavior_pack/trading/<all>.json", fileSources);
        for (const file of files) {
            const relativePath = getTradingRelativePath(file);
            if (relativePath) {
                tradingFilePaths.push(relativePath);
            }
        }

        return tradingFilePaths;
    }

    private static async getVanillaBiomeIdsWithoutNamespace(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const dataDrivenBiomeIds = await this.getBiomeIds(fileSources.filter(source => source instanceof MinecraftGame));
        const vanillaBiomeIdsWithoutNamespace = dataDrivenBiomeIds
            .filter(id => id.startsWith("minecraft:"))
            .map(id => id.replace("minecraft:", ""));
        
        return vanillaBiomeIdsWithoutNamespace;
    }

    private static async getVanillaBlockIdsWithoutNamespace(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const dataDrivenBlockIds = await this.getBlockIds(fileSources.filter(source => source instanceof MinecraftGame));
        const vanillaBlockIdsWithoutNamespace = dataDrivenBlockIds
            .filter(id => id.startsWith("minecraft:"))
            .map(id => id.replace("minecraft:", ""));
        
        return vanillaBlockIdsWithoutNamespace;
    }

    private static async getVanillaEntityIdsWithoutNamespace(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const dataDrivenEntityIds = await this.getEntityIds(fileSources.filter(source => source instanceof MinecraftGame));
        const vanillaEntityIdsWithoutNamespace = dataDrivenEntityIds
            .filter(id => id.startsWith("minecraft:"))
            .map(id => id.replace("minecraft:", ""));

        return vanillaEntityIdsWithoutNamespace;
    }

    private static async getVanillaItemGroupIdsWithoutNamespace(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const dataDrivenItemGroupIds = await this.getItemGroupIds(fileSources.filter(source => source instanceof MinecraftGame));
        const vanillaItemGroupIdsWithoutNamespace = dataDrivenItemGroupIds
            .filter(id => id.startsWith("minecraft:"))
            .map(id => id.replace("minecraft:", ""));
        return vanillaItemGroupIdsWithoutNamespace;
    }

    private static async getVanillaUiGlobalVariables(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const uiGlobalVariables: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/ui/_global_variables.json", fileSources.filter(source => source instanceof MinecraftGame));

        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                if (typeof json === "object") {
                    for (const key of Object.keys(json)) {
                        if (key.startsWith("$") === true) {
                            uiGlobalVariables.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse vanilla UI global variables from ${file.toString()}:`, error);
            }
        }

        return uiGlobalVariables;
    }

    private static async getWaterSettingsIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const waterSettingsIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/water/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:water_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    waterSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse water settings from ${file.toString()}:`, error);
            }
        }

        return waterSettingsIds;
    }

    private static async getCubemapSettingsIds(fileSources: (MinecraftProject | MinecraftGame)[]): Promise<string[]> {
        const cubemapSettingsIds: string[] = [];

        const files = await this.getDataDrivenFilesFromSources("resource_pack/cubemaps/<all>.json", fileSources);
        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:cubemap_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    cubemapSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse cubemap settings from ${file.toString()}:`, error);
            }
        }

        return cubemapSettingsIds;
    }

    private static async getVoxelShapeIds(fileSources: (MinecraftProject | MinecraftGame)[]): Promise<string[]> {
        const voxelShapeIds: string[] = [...(await this.getVanillaIdentifiersDist()).VANILLA_VOXEL_SHAPE_IDS];

        const voxelShapeFiles = await this.getDataDrivenFilesFromSources("behavior_pack/shapes/<all>.json", fileSources);
        for (const file of voxelShapeFiles) {
            try {
                const json = await this.getFileContent(file);
                const id = json?.["minecraft:voxel_shape"]?.description?.identifier;
                if (typeof id === "string") {
                    voxelShapeIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to read or parse voxel shape from ${file.toString()}:`, error);
            }
        }

        return voxelShapeIds;
    }

    private static async getBlockTags(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const blockTags: string[] = (await this.getVanillaIdentifiersDist()).VANILLA_BLOCK_TAGS;

        return blockTags;
    }

    private static async getDataDrivenBlockEntityIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        return ["minecraft:skull", "minecraft:bed", "minecraft:decorated_pot"];
    }
}