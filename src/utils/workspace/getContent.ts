import * as vscode from "vscode";
import { VANILLA_BLOCK_IDS, VANILLA_COOLDOWN_CATEGORY_IDS, VANILLA_DIMENSION_IDS, VANILLA_EFFECT_IDS, VANILLA_ENTITY_IDS, VANILLA_ITEM_IDS, VANILLA_ITEM_TAGS, VANILLA_ENCHANTMENT_IDS } from "../data/vanillaMinecraftIdentifiers";
import { parse as parseJsonc } from "jsonc-parser";
import { compareVersions } from "../../features/jsonSchema/utils/getSchemaForDocument";

import { minecraftStableGame, currentMinecraftProject } from "../../extension";

export class GetMinecraftContent {
    static vanillaBlockIds = VANILLA_BLOCK_IDS;
    static vanillaCooldownCategoryIds = VANILLA_COOLDOWN_CATEGORY_IDS;
    static vanillaCullingLayerIds = ["minecraft:culling_layer.undefined", "minecraft:culling_layer.leaves"];
    static vanillaDimensionIds = VANILLA_DIMENSION_IDS;
    static vanillaEntityIds = VANILLA_ENTITY_IDS;
    static vanillaEffectIds = VANILLA_EFFECT_IDS;
    static vanillaEnchantmentIds = VANILLA_ENCHANTMENT_IDS;
    static vanillaItemIds = VANILLA_ITEM_IDS;
    static vanillaItemTags = VANILLA_ITEM_TAGS;
    static fullBlockModelId = "minecraft:geometry.full_block";

    static async getAimAssistCategoryIds(): Promise<string[]> {
        const vanillaUris = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/aim_assist/categories/categories.json") || [];
        const projectUris = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/aim_assist/categories/categories.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const aimAssistCategoryIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const aimAssistCategories = json?.["minecraft:aim_assist_categories"]?.categories as any[];
                if (Array.isArray(aimAssistCategories)) {
                    for (const category of aimAssistCategories) {
                        const id = category?.name;
                        if (typeof id === "string") {
                            aimAssistCategoryIds.push(id);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...aimAssistCategoryIds]));
    }

    static async getAimAssistPresetIds(): Promise<string[]> {
        const vanillaUris = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/aim_assist/presets/<all>.json") || [];
        const projectUris = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/aim_assist/presets/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const aimAssistPresetIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:aim_assist_preset"]?.identifier;
                if (typeof id === "string") {
                    aimAssistPresetIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...aimAssistPresetIds]));
    }

    static async getAtmosphereSettingsIds(): Promise<string[]> {
        const vanillaUris = await minecraftStableGame?.getDataDrivenFiles("resource_pack/atmospherics/<all>.json") || [];
        const projectUris = await currentMinecraftProject?.getMinecraftFiles("resource_pack/atmospherics/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const atmosphereSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:atmosphere_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    atmosphereSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(atmosphereSettingsIds));
    }

    static async getBehaviorAnimationIds(): Promise<string[]> {
        const vanillaUris = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/animations/<all>.json") || [];
        const projectUris = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/animations/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const behaviorAnimationIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const animationsProperty = json?.animations;
                if (!animationsProperty || typeof animationsProperty !== "object") continue;
                const animationIds = Object.keys(animationsProperty);
                for (const animationId of animationIds) {
                    if (typeof animationsProperty[animationId] === "object") {
                        behaviorAnimationIds.push(animationId);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...behaviorAnimationIds]));
    }

    static async getBiomeIds(): Promise<string[]> {
        const vanillaUris = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/biomes/<all>.json") || [];
        const projectUris = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/biomes/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];
        
        const biomeIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:biome"]?.description?.identifier;
                if (typeof id === "string") {
                    biomeIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...biomeIds]));
    }

    static async getBiomeTags(): Promise<string[]> {
        const vanillaUris = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/biomes/<all>.json") || [];
        const projectUris = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/biomes/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const biomeTags: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const tags = json?.["minecraft:biome"]?.components?.["minecraft:tags"]?.tags;
                if (Array.isArray(tags)) {
                    for (const tag of tags) {
                        if (typeof tag === "string") {
                            biomeTags.push(tag);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(biomeTags));
    }

    static async getBlockCullingRulesIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/block_culling/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const customBlockCullingRulesIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = JSON.parse(content);

                const id = json?.["minecraft:block_culling_rules"]?.description?.identifier;
                if (typeof id === "string") {
                    customBlockCullingRulesIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(customBlockCullingRulesIds));
    }

    static async getBlockIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/blocks/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const customBlockIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:block"]?.description?.identifier;
                if (typeof id === "string") {
                    customBlockIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...this.vanillaBlockIds, ...customBlockIds]));
    }

    static async getBlockSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/sounds.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const baseBlockSoundReferences: string[] = [];
        const interactiveBlockSoundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const blockSoundsProperty = json?.["block_sounds"];
                if (typeof blockSoundsProperty === "object") {
                    const soundReferences = Object.keys(blockSoundsProperty);
                    for (const soundReference of soundReferences) {
                        if (typeof blockSoundsProperty[soundReference] === "object") {
                            baseBlockSoundReferences.push(soundReference);
                        }
                    }
                }

                const interactiveBlockSoundsProperty = json?.["interactive_sounds"]?.block_sounds;
                if (typeof interactiveBlockSoundsProperty === "object") {
                    const soundReferences = Object.keys(interactiveBlockSoundsProperty);
                    for (const soundReference of soundReferences) {
                        if (typeof interactiveBlockSoundsProperty[soundReference] === "object") {
                            interactiveBlockSoundReferences.push(soundReference);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...baseBlockSoundReferences, ...interactiveBlockSoundReferences]));
    }

    static async getBlockTextureReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/textures/terrain_texture.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/textures/terrain_texture.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const blockTextureReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const textureDataProperty = json?.texture_data;
                if (typeof textureDataProperty === "object") {
                    const keys = Object.keys(textureDataProperty);
                    for (const key of keys) {
                        if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                            blockTextureReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }
        
        return Array.from(new Set(blockTextureReferences));
    }

    static async getColorGradingSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/color_grading/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/color_grading/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const colorGradingSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:color_grading_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    colorGradingSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(colorGradingSettingsIds));
    }

    static async getCooldownCategoryIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/items/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/items/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const cooldownCategoryIds: string[] = [...this.vanillaCooldownCategoryIds];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const cooldownCategory = json?.["minecraft:item"]?.components?.["minecraft:cooldown"]?.category;
                if (typeof cooldownCategory === "string") {
                    cooldownCategoryIds.push(cooldownCategory);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(cooldownCategoryIds));
    }

    static async getCraftingRecipeTags(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/recipes/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/recipes/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const craftingRecipeTags: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

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
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(craftingRecipeTags));
    }

    static async getCullingLayerIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/blocks/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const customCullingLayerIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const cullingLayer = json?.["minecraft:block"]?.components?.["minecraft:geometry"]?.culling_layer;
                if (typeof cullingLayer === "string") {
                    customCullingLayerIds.push(cullingLayer);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...this.vanillaCullingLayerIds, ...customCullingLayerIds]));
    }

    static async getDataDrivenAimAssistCategoryIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/aim_assist/categories/categories.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const aimAssistCategoryIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const aimAssistCategories = json?.["minecraft:aim_assist_categories"]?.categories as any[];
                if (Array.isArray(aimAssistCategories)) {
                    for (const category of aimAssistCategories) {
                        const id = category?.name;
                        if (typeof id === "string") {
                            aimAssistCategoryIds.push(id);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...aimAssistCategoryIds]));
    }

    static async getDataDrivenAimAssistPresetIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/aim_assist/presets/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const customAimAssistPresetIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const aimAssistCategories = json?.["minecraft:aim_assist_categories"]?.categories as any[];
                if (Array.isArray(aimAssistCategories)) {
                    for (const category of aimAssistCategories) {
                        const id = category?.name;
                        if (typeof id === "string") {
                            customAimAssistPresetIds.push(id);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...customAimAssistPresetIds]));
    }
    
    static async getDataDrivenAtmosphereSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/atmospherics/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const atmosphereSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:atmosphere_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    atmosphereSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(atmosphereSettingsIds));
    }

    static async getDataDrivenAttachableIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/attachables/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const attachableIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:attachable"]?.description?.identifier;
                if (typeof id === "string") {
                    attachableIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(attachableIds));
    }

    static async getDataDrivenBaseBlockSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const baseBlockSoundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const blockSoundsProperty = json?.["block_sounds"];
                if (typeof blockSoundsProperty === "object") {
                    const soundReferences = Object.keys(blockSoundsProperty);
                    for (const soundReference of soundReferences) {
                        if (typeof blockSoundsProperty[soundReference] === "object") {
                            baseBlockSoundReferences.push(soundReference);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(baseBlockSoundReferences));
    }

    static async getDataDrivenBiomeIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/biomes/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const biomeIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:biome"]?.description?.identifier;
                if (typeof id === "string") {
                    biomeIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(biomeIds));
    }

    static async getDataDrivenBlockTextureReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/textures/terrain_texture.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const blockTextureReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const textureDataProperty = json?.texture_data;
                if (typeof textureDataProperty === "object") {
                    const keys = Object.keys(textureDataProperty);
                    for (const key of keys) {
                        if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                            blockTextureReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(blockTextureReferences));
    }

    static async getDataDrivenCameraPresetIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/cameras/presets/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const cameraPresetIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:camera_preset"]?.identifier;
                if (typeof id === "string") {
                    cameraPresetIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(cameraPresetIds));
    }

    static async getDataDrivenColorGradingSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/color_grading/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const colorGradingSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:color_grading_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    colorGradingSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(colorGradingSettingsIds));
    }

    static async getDataDrivenDimensionIds(): Promise<string[]> {
        return this.vanillaDimensionIds;
    }

    static async getDataDrivenEntityIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/entities/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const entityIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:entity"]?.description?.identifier;
                if (typeof id === "string") {
                    entityIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(entityIds));
    }

    static async getDataDrivenFeatureIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/features/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const featureIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

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
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(featureIds));
    }

    static async getDataDrivenFeatureRulesIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/feature_rules/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const featureRulesIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:feature_rules"]?.description?.identifier;
                if (typeof id === "string") {
                    featureRulesIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(featureRulesIds));
    }

    static async getDataDrivenFogIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/fogs/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const fogIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:fog_settings"]?.identifier;
                if (typeof id === "string") {
                    fogIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(fogIds));
    }

    static async getDataDrivenIndividualEventSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const individualEventSoundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const individualEventSoundsEvents = json?.individual_event_sounds?.events;
                if (typeof individualEventSoundsEvents !== "object") continue;
                const soundReferenceKeys = Object.keys(individualEventSoundsEvents);
                for (const key of soundReferenceKeys) {
                    if (typeof individualEventSoundsEvents[key] === "object") {
                        individualEventSoundReferences.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(individualEventSoundReferences));
    }

    static async getDataDrivenIndividualNamedSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const individualNamedSoundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const individualNamedSounds = json?.individual_named_sounds?.sounds;
                if (typeof individualNamedSounds !== "object") continue;
                const soundReferenceKeys = Object.keys(individualNamedSounds);
                for (const key of soundReferenceKeys) {
                    if (typeof individualNamedSounds[key] === "object") {
                        individualNamedSoundReferences.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(individualNamedSoundReferences));
    }

    static async getDataDrivenInteractiveBlockSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const interactiveBlockSoundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const interactiveBlockSoundsProperty = json?.["interactive_sounds"]?.block_sounds;
                if (typeof interactiveBlockSoundsProperty === "object") {
                    const soundReferences = Object.keys(interactiveBlockSoundsProperty);
                    for (const soundReference of soundReferences) {
                        if (typeof interactiveBlockSoundsProperty[soundReference] === "object") {
                            interactiveBlockSoundReferences.push(soundReference);
                        }
                    }
                }

            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(interactiveBlockSoundReferences));
    }

    static async getDataDrivenItemIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/items/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const itemIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:item"]?.description?.identifier;
                if (typeof id === "string") {
                    itemIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(itemIds));
    }

    static async getDataDrivenItemTextureReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/textures/item_texture.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const itemTextureReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const textureDataProperty = json?.texture_data;
                if (typeof textureDataProperty === "object") {
                    const keys = Object.keys(textureDataProperty);
                    for (const key of keys) {
                        if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                            itemTextureReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(itemTextureReferences));
    }

    static async getDataDrivenJigsawStructureIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/worldgen/structures/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const jigsawStructureIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:jigsaw"]?.description?.identifier;
                if (typeof id === "string") {
                    jigsawStructureIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(jigsawStructureIds));
    }

    static async getDataDrivenLanguageIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/texts/languages.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const languageIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const languageList = parseJsonc(content);

                if (Array.isArray(languageList) === false) continue;
                for (const language of languageList) {
                    if (typeof language === "string") {
                        languageIds.push(language);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(languageIds));
    }

    static async getDataDrivenLightingSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/lighting/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const lightingSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:lighting_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    lightingSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(lightingSettingsIds));
    }

    static async getDataDrivenModelIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/models/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const modelIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const formatVersion = json?.format_version;
                if (typeof formatVersion !== "string") continue;
                if (compareVersions(formatVersion, "1.8.0") >= 0 && compareVersions(formatVersion, "1.12.0") < 0) {
                    const keys = Object.keys(json);
                    for (const key of keys) {
                        if (key.startsWith("geometry.") && typeof json[key] === "object") {
                            modelIds.push(key);
                        }
                    }
                } else if (compareVersions(formatVersion, "1.12.0") >= 0) {
                    const minecraftGeometry = json?.["minecraft:geometry"];
                    if (Array.isArray(minecraftGeometry)) {
                        for (const geometry of minecraftGeometry) {
                            const identifier = geometry?.description?.identifier;
                            if (typeof identifier === "string") {
                                modelIds.push(identifier);
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(modelIds));
    }

    static async getDataDrivenMusicReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds/music_definitions.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const musicReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const keys = Object.keys(json);
                for (const key of keys) {
                    if (typeof json[key] !== "object") continue;
                    const eventName = json[key]?.event_name;
                    if (typeof eventName === "string") {
                        musicReferences.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(musicReferences));
    }

    static async getDataDrivenParticleEffectIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/particles/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const particleEffectIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["particle_effect"]?.description?.identifier;
                if (typeof id === "string") {
                    particleEffectIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(particleEffectIds));
    }

    static async getDataDrivenProcessorIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/worldgen/processors/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const processorIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:processor_list"]?.description?.identifier;
                if (typeof id === "string") {
                    processorIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(processorIds));
    }

    static async getDataDrivenRenderControllerIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/render_controllers/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const renderControllerIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const renderControllers = json?.render_controllers;
                if (!renderControllers || typeof renderControllers !== "object") continue;
                const renderControllerKeys = Object.keys(renderControllers);
                for (const key of renderControllerKeys) {
                    if (typeof renderControllers[key] === "object") {
                        renderControllerIds.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(renderControllerIds));
    }

    static async getDataDrivenRecipeIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/recipes/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const recipeIds = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

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
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(recipeIds));
    }

    static async getDataDrivenResourceAnimationControllerIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/animation_controllers/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const resourceAnimationControllerIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const animationControllers = json?.animation_controllers;
                if (!animationControllers || typeof animationControllers !== "object") continue;
                const animationControllerKeys = Object.keys(animationControllers);
                for (const key of animationControllerKeys) {
                    if (typeof animationControllers[key] === "object") {
                        resourceAnimationControllerIds.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(resourceAnimationControllerIds));
    }

    static async getDataDrivenResourceAnimationIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/animations/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const resourceAnimationIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const animationsProperty = json?.animations;
                if (!animationsProperty || typeof animationsProperty !== "object") continue;
                const animationIds = Object.keys(animationsProperty);
                for (const animationId of animationIds) {
                    if (typeof animationsProperty[animationId] === "object") {
                        resourceAnimationIds.push(animationId);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(resourceAnimationIds));
    }

    static async getDataDrivenSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds/sound_definitions.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const soundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const soundDefinitionsProperty = json?.sound_definitions;
                if (!soundDefinitionsProperty || typeof soundDefinitionsProperty !== "object") continue;
                const soundDefinitionKeys = Object.keys(soundDefinitionsProperty);
                for (const key of soundDefinitionKeys) {
                    if (typeof soundDefinitionsProperty[key] === "object") {
                        soundReferences.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(soundReferences));
    }

    static async getDataDrivenSpawnRulesIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/spawn_rules/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const spawnRulesIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:spawn_rules"]?.description?.identifier;
                if (typeof id === "string") {
                    spawnRulesIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(spawnRulesIds));
    }

    static async getDataDrivenStructureSetIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/worldgen/structure_sets/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const structureSetIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:structure_set"]?.description?.identifier;
                if (typeof id === "string") {
                    structureSetIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(structureSetIds));
    }

    static async getDataDrivenTemplatePoolIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/worldgen/template_pools/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const templatePoolIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:template_pool"]?.description?.identifier;
                if (typeof id === "string") {
                    templatePoolIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(templatePoolIds));
    }

    static async getDataDrivenWaterSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/water/<all>.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const waterSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:water_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    waterSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(waterSettingsIds));
    }

    static async getEffectIds(): Promise<string[]> {
        return this.vanillaEffectIds;
    }

    static async getEntityFamilyIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/entities/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/entities/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const entityFamilyIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const families = json?.["minecraft:entity"]?.components?.["minecraft:type_family"]?.family;
                if (Array.isArray(families)) {
                    for (const family of families) {
                        if (typeof family === "string") {
                            entityFamilyIds.push(family);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(entityFamilyIds));
    }

    static async getEntityIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/entities/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const customEntityIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:entity"]?.description?.identifier;
                if (typeof id === "string") {
                    customEntityIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set([...this.vanillaEntityIds, ...customEntityIds]));
    }

    static async getFeatureIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/features/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/features/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const featureIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

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
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(featureIds));
    }

    static async getFogIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/fogs/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/fogs/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const fogIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:fog_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    fogIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(fogIds));
    }
    
    static async getInheritableCameraPresetIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/cameras/presets/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/cameras/presets/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const inheritableCameraPresetIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = JSON.parse(content);

                const id = json?.["minecraft:camera_preset"]?.identifier;
                if (typeof id === "string" && id !== "minecraft:first_person") {
                    inheritableCameraPresetIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(inheritableCameraPresetIds));
    }

    static async getItemGroupIds(): Promise<string[]> {
        const itemGroupIds: string[] = [];

        const vanillaCraftingItemCatalogUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/item_catalog/crafting_item_catalog.json") || [];
        const projectCraftingItemCatalogUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/item_catalog/crafting_item_catalog.json") || [];
        const craftingItemCatalogUris = [...vanillaCraftingItemCatalogUris, ...projectCraftingItemCatalogUris];

        for (const uri of craftingItemCatalogUris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);
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
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        const vanillaBlockUris: vscode.Uri[] = [];
        const projectBlockUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/blocks/<all>.json") || [];
        const blockUris = [...vanillaBlockUris, ...projectBlockUris];
        for (const uri of blockUris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const itemGroupProperty = json?.["minecraft:block"]?.description?.menu_category?.group;
                if (typeof itemGroupProperty === "string") {
                    itemGroupIds.push(itemGroupProperty);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        const vanillaItemUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/items/<all>.json") || [];
        const projectItemUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/items/<all>.json") || [];
        const itemUris = [...vanillaItemUris, ...projectItemUris];
        for (const uri of itemUris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const itemGroupProperty = json?.["minecraft:item"]?.description?.menu_category?.group;
                if (typeof itemGroupProperty === "string") {
                    itemGroupIds.push(itemGroupProperty);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(itemGroupIds));
    }

    static async getItemIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/items/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const customItemIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:item"]?.description?.identifier;
                if (typeof id === "string") {
                    customItemIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }
        return Array.from(new Set([...this.vanillaItemIds, ...customItemIds]));
    }

    static async getItemTags(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/items/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/items/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const itemTags: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const tags = json?.["minecraft:item"]?.components?.["minecraft:tags"]?.tags;
                if (Array.isArray(tags)) {
                    for (const tag of tags) {
                        if (typeof tag === "string") {
                            itemTags.push(tag);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(...this.vanillaItemTags, ...itemTags));
    }

    static async getItemTextureReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/textures/item_texture.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/textures/item_texture.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const itemTextureReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const textureDataProperty = json?.texture_data;
                if (typeof textureDataProperty === "object") {
                    const keys = Object.keys(textureDataProperty);
                    for (const key of keys) {
                        if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                            itemTextureReferences.push(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(itemTextureReferences));
    }

    static async getLanguageIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/texts/languages.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/texts/languages.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const languageIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const languageList = parseJsonc(content);

                if (Array.isArray(languageList) === false) continue;
                for (const language of languageList) {
                    if (typeof language === "string") {
                        languageIds.push(language);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(languageIds));
    }

    static async getLightingSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/lighting/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/lighting/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const lightingSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:lighting_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    lightingSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(lightingSettingsIds));
    }

    static async getLootTableFilePaths(): Promise<string[]> {
        function getLootTableRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](loot_tables[\/\\].+\.json)$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/loot_tables/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/loot_tables/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const lootTableFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getLootTableRelativePath(uri);
            if (relativePath) {
                lootTableFilePaths.push(relativePath);
            }
        }

        return lootTableFilePaths;
    }

    static async getMcfunctionFilePathsWithoutExtension(): Promise<string[]> {
        function getMcfunctionRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](functions[\/\\].+)\.mcfunction$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/functions/<all>.mcfunction") || [];
        const uris = [...vanillaUris, ...projectUris];

        const mcfunctionFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getMcfunctionRelativePath(uri);
            if (relativePath) {
                mcfunctionFilePaths.push(relativePath);
            }
        }

        return mcfunctionFilePaths;
    }

    static async getModelIds(): Promise<string[]> {
        const modelIds: string[] = ["minecraft:geometry.cross"];

        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/models/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/models/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const formatVersion = json?.format_version;
                if (typeof formatVersion !== "string") continue;
                if (compareVersions(formatVersion, "1.8.0") >= 0 && compareVersions(formatVersion, "1.12.0") < 0) {
                    const keys = Object.keys(json);
                    for (const key of keys) {
                        if (key.startsWith("geometry.") && typeof json[key] === "object") {
                            modelIds.push(key);
                        }
                    }
                } else if (compareVersions(formatVersion, "1.12.0") >= 0) {
                    const minecraftGeometry = json?.["minecraft:geometry"];
                    if (Array.isArray(minecraftGeometry)) {
                        for (const geometry of minecraftGeometry) {
                            const identifier = geometry?.description?.identifier;
                            if (typeof identifier === "string") {
                                modelIds.push(identifier);
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return modelIds;
    }

    static async getMusicReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds/music_definitions.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/sounds/music_definitions.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const musicReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const keys = Object.keys(json);
                for (const key of keys) {
                    if (typeof json[key] !== "object") continue;
                    const eventName = json[key]?.event_name;
                    if (typeof eventName === "string") {
                        musicReferences.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(musicReferences));
    }

    static async getOldFormatItemIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/items/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/items/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const oldFormatItemIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:item"]?.description?.identifier;
                if (typeof id === "string") {

                    const formatVersion = json?.format_version;
                    if (typeof formatVersion !== "string") continue;
                    if (compareVersions(formatVersion, "1.16.100") >= 0) {
                        if (oldFormatItemIds.includes(id)) {
                            oldFormatItemIds.splice(oldFormatItemIds.indexOf(id), 1);
                        }
                        continue; // Ignore items with format version 1.16.100 or higher
                    }

                    oldFormatItemIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(oldFormatItemIds));
    }

    static async getParticleEffectIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/particles/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/particles/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const particleEffectIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["particle_effect"]?.description?.identifier;
                if (typeof id === "string") {
                    particleEffectIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(particleEffectIds));
    }

    static async getProcessorIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/worldgen/processors/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/worldgen/processors/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const processorIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:processor_list"]?.description?.identifier;
                if (typeof id === "string") {
                    processorIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(processorIds));
    }

    static async getProjectTextureFilePaths(): Promise<string[]> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/textures/*.{tga,png,jpg,jpeg}") || [];
        const uris = [...vanillaUris, ...projectUris];

        const textureFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getTextureRelativePath(uri);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        return textureFilePaths;
    }
    
    static async getProjectUiFilePaths(): Promise<string[]> {
        function getUiRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](ui[\/\\].+\.(json))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/ui/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/ui/<all>.json") || [];

        const vanillaUiFilePaths: string[] = [];
        for (const uri of vanillaUris) {
            const relativePath = getUiRelativePath(uri);
            if (relativePath) {
                vanillaUiFilePaths.push(relativePath);
            }
        }

        const uiFilePaths: string[] = [];
        for (const uri of projectUris) {
            const relativePath = getUiRelativePath(uri);
            if (relativePath) {
                if (vanillaUiFilePaths.includes(relativePath) === false) {
                    uiFilePaths.push(relativePath);
                }
            }
        }

        return uiFilePaths;
    }

    static async getRenderControllerIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/render_controllers/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/render_controllers/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const renderControllerIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const renderControllers = json?.render_controllers;
                if (!renderControllers || typeof renderControllers !== "object") continue;
                const renderControllerKeys = Object.keys(renderControllers);
                for (const key of renderControllerKeys) {
                    if (typeof renderControllers[key] === "object") {
                        renderControllerIds.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(renderControllerIds));
    }

    static async getResourceAnimationControllerIds() : Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/animation_controllers/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/animation_controllers/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const animationControllerIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const animationControllers = json?.animation_controllers;
                if (!animationControllers || typeof animationControllers !== "object") continue;
                const animationControllerKeys = Object.keys(animationControllers);
                for (const key of animationControllerKeys) {
                    if (typeof animationControllers[key] === "object") {
                        animationControllerIds.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(animationControllerIds));
    }

    static async getResourceAnimationIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/animations/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/animations/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const animationIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const animations = json?.animations;
                if (!animations || typeof animations !== "object") continue;
                const animationKeys = Object.keys(animations);
                for (const key of animationKeys) {
                    if (typeof animations[key] === "object") {
                        animationIds.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(animationIds));
    }

    static async getSoundFilePathsWithoutExtension(): Promise<string[]> {
        function getSoundRelativePath(uri: vscode.Uri): string | null {
            // Ajout de fsb et extension supprimée dans le résultat
            const match = /[\/\\](sounds[\/\\].+?)(?:\.(ogg|wav|mp3|fsb))?$/i.exec(uri.fsPath);
            if (!match) { return null; }
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds/*.{wav,mp3,ogg,fsb}") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/sounds/*.{wav,mp3,ogg,fsb}") || [];
        const uris = [...vanillaUris, ...projectUris];

        const soundFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getSoundRelativePath(uri);
            if (relativePath) {
                soundFilePaths.push(relativePath);
            }
        }

        return soundFilePaths;
    }

    static async getSoundReferences(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/sounds/sound_definitions.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/sounds/sound_definitions.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const soundReferences: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const soundDefinitions = json?.sound_definitions;
                if (!soundDefinitions || typeof soundDefinitions !== "object") continue;
                const soundDefinitionKeys = Object.keys(soundDefinitions);
                for (const key of soundDefinitionKeys) {
                    if (typeof soundDefinitions[key] === "object") {
                        soundReferences.push(key);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(soundReferences));
    }

    static async getTemplatePoolIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/worldgen/template_pools/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/worldgen/template_pools/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const templatePoolIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:template_pool"]?.description?.identifier;
                if (typeof id === "string") {
                    templatePoolIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(templatePoolIds));
    }

    static async getTextureFilePaths(): Promise<string[]> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/textures/*.{tga,png,jpg,jpeg}") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/textures/*.{tga,png,jpg,jpeg}") || [];
        const uris = [...vanillaUris, ...projectUris];

        const textureFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getTextureRelativePath(uri);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        return textureFilePaths;
    }

    static async getTradingFilePaths(): Promise<string[]> {
        function getTradingRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](trading[\/\\].+\.json)$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("behavior_pack/trading/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("behavior_pack/trading/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const tradingFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getTradingRelativePath(uri);
            if (relativePath) {
                tradingFilePaths.push(relativePath);
            }
        }

        return tradingFilePaths;
    }

    static async getVanillaBiomeIdsWithoutNamespace(): Promise<string[]> {
        const biomeIds = await this.getDataDrivenBiomeIds();
        return biomeIds.map(id =>
            id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
        );
    }

    static async getVanillaBlockIdsWithoutNamespace(): Promise<string[]> {
        return this.vanillaBlockIds.map(id =>
            id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
        );
    }

    static async getVanillaEntityIdsWithoutNamespace(): Promise<string[]> {
        return this.vanillaEntityIds.map(id =>
            id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
        );
    }

    static async getVanillaUiGlobalVariables(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/ui/_global_variables.json") || [];
        const projectUris: vscode.Uri[] = [];
        const uris = [...vanillaUris, ...projectUris];

        const globalVariables: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                if (typeof json === "object") {
                    const variables = Object.keys(json);
                    for (const variable of variables) {
                        if (variable.startsWith("$") === true) {
                            globalVariables.push(variable);
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(globalVariables));
    }

    static async getVanillaItemGroupIdsWithoutNamespace(): Promise<string[]> {
        const itemGroupIds = await this.getItemGroupIds();
        return itemGroupIds.filter(id => id.startsWith("minecraft:")).map(id => id.slice("minecraft:".length));
    }

    static async getWaterSettingsIds(): Promise<string[]> {
        const vanillaUris: vscode.Uri[] = await minecraftStableGame?.getDataDrivenFiles("resource_pack/water/<all>.json") || [];
        const projectUris: vscode.Uri[] = await currentMinecraftProject?.getMinecraftFiles("resource_pack/water/<all>.json") || [];
        const uris = [...vanillaUris, ...projectUris];

        const waterSettingsIds: string[] = [];
        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                const id = json?.["minecraft:water_settings"]?.description?.identifier;
                if (typeof id === "string") {
                    waterSettingsIds.push(id);
                }
            } catch (error) {
                console.warn(`⚠️ Error reading file ${uri.fsPath}:`, error);
            }
        }

        return Array.from(new Set(waterSettingsIds));
    }
}