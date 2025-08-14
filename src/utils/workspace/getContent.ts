import * as vscode from "vscode";
import { VANILLA_AIM_ASSIST_PRESET_IDS, VANILLA_BIOMES_IDS, VANILLA_BIOMES_TAGS, VANILLA_BLOCK_IDS, VANILLA_CAMERA_PRESETS_IDS, VANILLA_COOLDOWN_CATEGORY_IDS, VANILLA_DATA_DRIVEN_ITEM_IDS, VANILLA_DIMENSION_IDS, VANILLA_EFFECT_IDS, VANILLA_ENTITY_IDS, VANILLA_ITEM_GROUP_IDS, VANILLA_ITEM_IDS, VANILLA_ITEM_TAGS, VANILLA_ENTITY_FAMILY_IDS, VANILLA_AIM_ASSIST_CATEGORY_IDS } from "../data/vanillaMinecraftIdentifiers";
import * as path from "path";
import { parse as parseJsonc } from "jsonc-parser";
import { compareVersions } from "../../features/jsonSchema/utils/getSchemaForDocument";
import { isMinecraftProject } from "./isMinecraftProject";


export class GetMinecraftContent {
    static vanillaBlockIds = VANILLA_BLOCK_IDS;
    static vanillaCooldownCategoryIds = VANILLA_COOLDOWN_CATEGORY_IDS;
    static vanillaCullingLayerIds = ["minecraft:culling_layer.undefined", "minecraft:culling_layer.leaves"];
    static vanillaDimensionIds = ["minecraft:nether", "minecraft:overworld", "minecraft:the_end"];
    static vanillaEntityIds = VANILLA_ENTITY_IDS;
    static vanillaEffectIds = VANILLA_EFFECT_IDS;
    static vanillaItemIds = VANILLA_ITEM_IDS;
    static vanillaItemTags = VANILLA_ITEM_TAGS;

    static fullBlockModelId = "minecraft:geometry.full_block";

    static async getAimAssistCategoryIds(): Promise<string[]> {
        const aimAssistCategoryIds: string[] = [];
        try {
            const uris = [...await GetMinecraftVanillaFiles.getAimAssistCategoriesFilesBP(), ...await GetMinecraftProjectFiles.getAimAssistCategoriesFilesBP()];
            for (const uri of uris) {
                try {
                    const fileData = await vscode.workspace.fs.readFile(uri);
                    const content = new TextDecoder('utf-8').decode(fileData);
                    const json = JSON.parse(content);

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
        } catch (error) {

        }

        return Array.from(new Set([...aimAssistCategoryIds]));
    }

    static async getAimAssistPresetIds(): Promise<string[]> {
        const aimAssistPresetIds: string[] = [];
        try {
            const uris = [...await GetMinecraftVanillaFiles.getAimAssistPresetFilesBP(), ...await GetMinecraftProjectFiles.getAimAssistPresetFilesBP()];
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
        } catch (error) {

        }

        return Array.from(new Set([...aimAssistPresetIds]));
    }

    static async getAtmosphereSettingsIds(): Promise<string[]> {
        const atmosphereSettingsIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getAtmosphereSettingsFilesRP(), ...await GetMinecraftProjectFiles.getAtmosphereSettingsFilesRP()];

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
        const behaviorAnimationIds: string[] = [];
        const uris = await GetMinecraftProjectFiles.getAnimationsFilesBP();

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
        const uris = [...await GetMinecraftVanillaFiles.getBiomeFilesBP(), ...await GetMinecraftProjectFiles.getBiomeFilesBP()];
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
        const biomeTags: string[] = [];
        const biomeUris = [...await GetMinecraftVanillaFiles.getBiomeFilesBP(), ...await GetMinecraftProjectFiles.getBiomeFilesBP()];
        for (const uri of biomeUris) {
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
        const uris = await GetMinecraftProjectFiles.getBlockCullingRulesFilesRP();
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
        const customBlockIds: string[] = [];
        const uris = await GetMinecraftProjectFiles.getBlockFilesBP();

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

    static async getBlockTextureReferences(): Promise<string[]> {
        const blockTextureReferences: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getTerrainTextureFilesRP(), ...await GetMinecraftProjectFiles.getTerrainTextureFilesRP()];
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
        const colorGradingSettingsIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getColorGradingFilesRP(), ...await GetMinecraftProjectFiles.getColorGradingFilesRP()];
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
        const cooldownCategoryIds: string[] = [...this.vanillaCooldownCategoryIds];
        const itemUris = await GetMinecraftProjectFiles.getItemFilesBP();
        for (const uri of itemUris) {
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
        const craftingRecipeTags: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getRecipeFilesBP(), ...await GetMinecraftProjectFiles.getRecipeFilesBP()];
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
        const blockUris = await GetMinecraftProjectFiles.getBlockFilesBP();
        const customCullingLayerIds: string[] = [];
        for (const uri of blockUris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = JSON.parse(content);

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
        const aimAssistCategoryIds: string[] = [];

        try {
            const jsonAimAssistCategoryFiles: vscode.Uri[] = await GetMinecraftVanillaFiles.getAimAssistCategoriesFilesBP();

            const jsonAimAssistCategoryFilePaths = jsonAimAssistCategoryFiles.map(u => u.fsPath);
            for (const jsonAimAssistCategoryFilePath of jsonAimAssistCategoryFilePaths) {
                try {
                    const fileData = await vscode.workspace.fs.readFile(vscode.Uri.file(jsonAimAssistCategoryFilePath));
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

                }
            }
        } catch (error) {

        }

        return Array.from(new Set([...aimAssistCategoryIds]));
    }

    static async getDataDrivenAimAssistPresetIds(): Promise<string[]> {
        const customAimAssistPresetIds: string[] = [];
        try {
            const jsonAimAssistPresetFiles: vscode.Uri[] = await GetMinecraftVanillaFiles.getAimAssistPresetFilesBP();

            const jsonAimAssistPresetFilePaths = jsonAimAssistPresetFiles.map(u => u.fsPath);
            for (const jsonAimAssistPresetFilePath of jsonAimAssistPresetFilePaths) {
                try {
                    const fileData = await vscode.workspace.fs.readFile(vscode.Uri.file(jsonAimAssistPresetFilePath));
                    const content = new TextDecoder('utf-8').decode(fileData);
                    const json = parseJsonc(content);

                    const id = json?.["minecraft:aim_assist_preset"]?.identifier;
                    if (typeof id === "string") {
                        customAimAssistPresetIds.push(id);
                    }
                } catch (error) {

                }
            }
        } catch (error) {

        }

        return Array.from(new Set([...customAimAssistPresetIds]));
    }
    
    static async getDataDrivenAtmosphereSettingsIds(): Promise<string[]> {
        const atmosphereSettingsIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getAtmosphereSettingsFilesRP();

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
        const attachableIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getAttachableFilesRP();

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

    static async getDataDrivenBiomeIds(): Promise<string[]> {
        const biomeIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getBiomeFilesBP();

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

    static async getDataDrivenCameraPresetIds(): Promise<string[]> {
        const cameraPresetIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getCameraPresetFilesBP(), ...await GetMinecraftProjectFiles.getCameraPresetFilesBP()];

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
        const colorGradingSettingsIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getColorGradingFilesRP();

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

    static async getDataDrivenFeatureRulesIds(): Promise<string[]> {
        const featureRulesIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getFeatureRulesFilesBP();

        for (const uri of uris) {
            try {
                const fileData = await vscode.workspace.fs.readFile(uri);
                const content = new TextDecoder('utf-8').decode(fileData);
                const json = parseJsonc(content);

                console.log(`Processing file: ${uri.fsPath}`);

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
        const fogIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getFogFilesRP();

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

    static async getDataDrivenItemIds(): Promise<string[]> {
        const itemIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getItemFilesBP();

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

        return Array.from(new Set([...this.vanillaItemIds, ...itemIds]));
    }

    static async getDataDrivenJigsawStructureIds(): Promise<string[]> {
        const jigsawStructureIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getJigsawStructureFilesBP();

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

    static async getDataDrivenLightingSettingsIds(): Promise<string[]> {
        const lightingSettingsIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getLightingSettingsFilesRP();

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
        const modelIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getModelFilesRP();

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

    static async getDataDrivenParticleEffectIds(): Promise<string[]> {
        const particleEffectIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getParticleEffectFilesRP();

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
        const processorIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getProcessorFilesBP();

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
        const renderControllerIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getRenderControllerFilesRP();

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

    static async getDataDrivenResourceAnimationControllerIds(): Promise<string[]> {
        const resourceAnimationControllerIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getAnimationControllerFilesRP();

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
        const resourceAnimationIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getAnimationFilesRP();

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

    static async getDataDrivenSpawnRulesIds(): Promise<string[]> {
        const spawnRulesIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getSpawnRuleFilesBP();

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
        const structureSetIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getStructureSetFilesBP();

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
        const templatePoolIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getTemplatePoolFilesBP();

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
        const waterSettingsIds: string[] = [];
        const uris = await GetMinecraftVanillaFiles.getWaterSettingsFilesRP();

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

    static async getEntityIds(): Promise<string[]> {
        const uris = await GetMinecraftProjectFiles.getEntityFilesBP();
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
        const featureIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getFeatureFilesBP(), ...await GetMinecraftProjectFiles.getFeatureFilesBP()];
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
        const fogIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getFogFilesRP(), ...await GetMinecraftProjectFiles.getFogFilesRP()];

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
        const inheritableCameraPresetIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getCameraPresetFilesBP(), ...await GetMinecraftProjectFiles.getCameraPresetFilesBP()];
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
        const craftingItemCatalogUris = [...await GetMinecraftVanillaFiles.getCraftingItemCatalogFilesBP(), ...await GetMinecraftProjectFiles.getCraftingItemCatalogFilesBP()];
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

        const blockUris = await GetMinecraftProjectFiles.getBlockFilesBP();
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

        const itemUris = [...await GetMinecraftProjectFiles.getItemFilesBP(), ...await GetMinecraftVanillaFiles.getItemFilesBP()];
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
        const uris = await GetMinecraftProjectFiles.getItemFilesBP();
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
        const itemTags: string[] = [];
        const itemUris = [...await GetMinecraftVanillaFiles.getItemFilesBP(), ...await GetMinecraftProjectFiles.getItemFilesBP()];
        for (const uri of itemUris) {
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
        const itemTextureReferences: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getItemTextureFilesRP(), ...await GetMinecraftProjectFiles.getItemTextureFilesRP()];
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

    static async getLightingSettingsIds(): Promise<string[]> {
        const lightingSettingsIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getLightingSettingsFilesRP(), ...await GetMinecraftProjectFiles.getLightingSettingsFilesRP()];

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

        const uris = [...await GetMinecraftVanillaFiles.getLootTableFilesBP(), ...await GetMinecraftProjectFiles.getLootTableFilesBP()];

        const lootTableFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getLootTableRelativePath(uri);
            if (relativePath) {
                lootTableFilePaths.push(relativePath);
            }
        }

        return lootTableFilePaths;
    }

    static async getModelIds(): Promise<string[]> {
        const modelIds: string[] = ["minecraft:geometry.cross"];
        const uris = [...await GetMinecraftVanillaFiles.getModelFilesRP(), ...await GetMinecraftProjectFiles.getModelFilesRP()];
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

    static async getParticleEffectIds(): Promise<string[]> {
        const particleEffectIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getParticleEffectFilesRP(), ...await GetMinecraftProjectFiles.getParticleEffectFilesRP()];
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

    static async getRenderControllerIds(): Promise<string[]> {
        const renderControllerIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getRenderControllerFilesRP(), ...await GetMinecraftProjectFiles.getRenderControllerFilesRP()];
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
        const animationControllerIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getAnimationControllerFilesRP(), ...await GetMinecraftProjectFiles.getAnimationControllerFilesRP()];
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
        const animationIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getAnimationFilesRP(), ...await GetMinecraftProjectFiles.getAnimationFilesRP()];
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

    static async getTextureFilePaths(): Promise<string[]> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }

        const uris = [...await GetMinecraftVanillaFiles.getTextureFilesRP(), ...await GetMinecraftProjectFiles.getTextureFilesRP()];
        const textureFilePaths: string[] = [];
        for (const uri of uris) {
            const relativePath = getTextureRelativePath(uri);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        return textureFilePaths;
    }

    static async getVanillaBiomeIds(): Promise<string[]> {
        const biomeIds: string[] = [];
        const programFiles = process.env.PROGRAMFILES;
        if (!programFiles) {
            console.warn("❌ Impossible de déterminer le dossier Program Files.");
            return biomeIds;
        }

        try {
            const windowsAppsPath = path.join(programFiles, "WindowsApps");
            const windowsAppsUri = vscode.Uri.file(windowsAppsPath);
            const windowsAppsEntries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

            const minecraftEntry = windowsAppsEntries.find(([name, type]) =>
                type === vscode.FileType.Directory &&
                name.startsWith("Microsoft.MinecraftUWP_") &&
                name.includes("_x64__8wekyb3d8bbwe")
            );
            if (!minecraftEntry) {
                console.warn("❌ Dossier Minecraft UWP introuvable dans WindowsApps.");
                return [];
            }

            const behaviorPacksPath = path.join(
                windowsAppsPath,
                minecraftEntry[0],
                "data",
                "behavior_packs"
            );
            const behaviorPacksUri = vscode.Uri.file(behaviorPacksPath);

            const packs = await vscode.workspace.fs.readDirectory(behaviorPacksUri);
            if (!packs.length) {
                console.warn("ℹ️ Aucun behavior_pack trouvé.");
                return [];
            }

            const jsonBiomeFiles: vscode.Uri[] = [];
            for (const [packName, type] of packs) {
                if (type !== vscode.FileType.Directory) continue;

                const biomesDir = vscode.Uri.file(path.join(behaviorPacksPath, packName, "biomes"));
                const exists = await pathExists(biomesDir);
                if (!exists) continue;

                await collectJsonFiles(biomesDir, jsonBiomeFiles);
            }

            const jsonBiomeFilePaths = jsonBiomeFiles.map(u => u.fsPath);
            for (const jsonBiomeFilePath of jsonBiomeFilePaths) {
                try {
                    const fileData = await vscode.workspace.fs.readFile(vscode.Uri.file(jsonBiomeFilePath));
                    const content = new TextDecoder('utf-8').decode(fileData);
                    const json = JSON.parse(content);

                    const id = json?.["minecraft:biome"]?.description?.identifier;
                    if (typeof id === "string") {
                        biomeIds.push(id);
                    }
                } catch (error) {
                    console.warn(`⚠️ Error reading biome file ${jsonBiomeFilePath}:`, error);
                }
            }
        } catch (error) {

        }

        return Array.from(new Set([...biomeIds]));
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

    static async getVanillaCameraPresetIds(): Promise<string[]> {
        const cameraPresetIds: string[] = [];
        const programFiles = process.env.PROGRAMFILES;
        if (!programFiles) {
            console.warn("❌ Impossible de déterminer le dossier Program Files.");
            return cameraPresetIds;
        }

        try {
            // Locate Minecraft UWP folder (package name varies with version)
            const windowsAppsPath = path.join(programFiles, "WindowsApps");
            const windowsAppsUri = vscode.Uri.file(windowsAppsPath);
            const windowsAppsEntries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

            const minecraftEntry = windowsAppsEntries.find(([name, type]) =>
                type === vscode.FileType.Directory &&
                name.startsWith("Microsoft.MinecraftUWP_") &&
                name.includes("_x64__8wekyb3d8bbwe")
            );
            if (!minecraftEntry) {
                console.warn("❌ Dossier Minecraft UWP introuvable dans WindowsApps.");
                return [];
            }

            const behaviorPacksPath = path.join(
                windowsAppsPath,
                minecraftEntry[0],
                "data",
                "behavior_packs"
            );
            const behaviorPacksUri = vscode.Uri.file(behaviorPacksPath);

            const packs = await vscode.workspace.fs.readDirectory(behaviorPacksUri);
            if (!packs.length) {
                console.warn("ℹ️ Aucun behavior_pack trouvé.");
                return [];
            }

            const jsonCameraPresetFiles: vscode.Uri[] = [];
            for (const [packName, type] of packs) {
                if (type !== vscode.FileType.Directory) continue;

                const cameraPresetsDir = vscode.Uri.file(path.join(behaviorPacksPath, packName, "cameras", "presets"));
                const exists = await pathExists(cameraPresetsDir);
                if (!exists) continue;

                await collectJsonFiles(cameraPresetsDir, jsonCameraPresetFiles);
            }

            const jsonCameraPresetFilePaths = jsonCameraPresetFiles.map(u => u.fsPath);
            for (const jsonCameraPresetFilePath of jsonCameraPresetFilePaths) {
                try {
                    const fileData = await vscode.workspace.fs.readFile(vscode.Uri.file(jsonCameraPresetFilePath));
                    const content = new TextDecoder('utf-8').decode(fileData);
                    const json = JSON.parse(content);

                    const id = json?.["minecraft:camera_preset"]?.identifier;
                    if (typeof id === "string") {
                        cameraPresetIds.push(id);
                    }
                } catch (error) {
                    console.warn(`⚠️ Error reading camera preset file ${jsonCameraPresetFilePath}:`, error);
                }
            }
        } catch (error) {

        }

        return Array.from(new Set([...cameraPresetIds]));
    }

    static async getVanillaDimensionIds(): Promise<string[]> {
        return this.vanillaDimensionIds;
    }

    static async getVanillaEntityIdsWithoutNamespace(): Promise<string[]> {
        return this.vanillaEntityIds.map(id =>
            id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
        );
    }

    static async getVanillaItemGroupIdsWithoutNamespace(): Promise<string[]> {
        const itemGroupIds = await this.getItemGroupIds();
        return itemGroupIds.filter(id => id.startsWith("minecraft:")).map(id => id.slice("minecraft:".length));
    }

    static async getWaterSettingsIds(): Promise<string[]> {
        const waterSettingsIds: string[] = [];
        const uris = [...await GetMinecraftVanillaFiles.getWaterSettingsFilesRP(), ...await GetMinecraftProjectFiles.getWaterSettingsFilesRP()];

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

async function pathExists(uri: vscode.Uri): Promise<boolean> {
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
}

async function collectJsonFiles(dir: vscode.Uri, out: vscode.Uri[]): Promise<void> {
    try {
        const entries = await vscode.workspace.fs.readDirectory(dir);
        for (const [name, type] of entries) {
            const child = vscode.Uri.joinPath(dir, name);
            if (type === vscode.FileType.File) {
                if (name.toLowerCase().endsWith(".json")) out.push(child);
            } else if (type === vscode.FileType.Directory) {
                await collectJsonFiles(child, out);
            }
        }
    } catch {
        // Some locked/system dirs may throw; just skip.
    }
}

async function collectFiles(dir: vscode.Uri, out: vscode.Uri[], extensions: string[]): Promise<void> {
    try {
        const entries = await vscode.workspace.fs.readDirectory(dir);
        for (const [name, type] of entries) {
            const child = vscode.Uri.joinPath(dir, name);
            if (type === vscode.FileType.File) {
                if (extensions.some(ext => name.toLowerCase().endsWith(ext))) out.push(child);
            } else if (type === vscode.FileType.Directory) {
                await collectFiles(child, out, extensions);
            }
        }
    } catch {
        // Some locked/system dirs may throw; just skip.
    }
    
}

export class GetMinecraftVanillaFiles {
    private static async getDefinitionsPath() {
        const programFiles = process.env.PROGRAMFILES;
        if (!programFiles) {
            console.warn("❌ Impossible de déterminer le dossier Program Files.");
            return [];
        }

        const windowsAppsPath = path.join(programFiles, "WindowsApps");
        const windowsAppsUri = vscode.Uri.file(windowsAppsPath);
        const windowsAppsEntries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

        const minecraftEntry = windowsAppsEntries.find(([name, type]) =>
            type === vscode.FileType.Directory &&
            name.startsWith("Microsoft.MinecraftUWP_") &&
            name.includes("_x64__8wekyb3d8bbwe")
        );
        if (!minecraftEntry) {
            console.warn("❌ Dossier Minecraft UWP introuvable dans WindowsApps.");
            return [];
        }

        const definitionsPath = path.join(
            windowsAppsPath,
            minecraftEntry[0],
            "data",
            "definitions"
        );
        const definitionsUri = vscode.Uri.file(definitionsPath);
        const definitionsExists = await pathExists(definitionsUri);
        if (!definitionsExists) {
            console.warn("❌ Dossier definitions introuvable dans le dossier Minecraft UWP.");
            return [];
        }
        return [definitionsUri.fsPath];
    }

    private static async getVanillaBehaviorPacks() {
        const programFiles = process.env.PROGRAMFILES;
        if (!programFiles) {
            console.warn("❌ Impossible de déterminer le dossier Program Files.");
            return [];
        }

        const windowsAppsPath = path.join(programFiles, "WindowsApps");
        const windowsAppsUri = vscode.Uri.file(windowsAppsPath);
        const windowsAppsEntries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

        const minecraftEntry = windowsAppsEntries.find(([name, type]) =>
            type === vscode.FileType.Directory &&
            name.startsWith("Microsoft.MinecraftUWP_") &&
            name.includes("_x64__8wekyb3d8bbwe")
        );
        if (!minecraftEntry) {
            console.warn("❌ Dossier Minecraft UWP introuvable dans WindowsApps.");
            return [];
        }

        const behaviorPacksPath = path.join(
            windowsAppsPath,
            minecraftEntry[0],
            "data",
            "behavior_packs"
        );
        const behaviorPacksUri = vscode.Uri.file(behaviorPacksPath);

        const packs = await vscode.workspace.fs.readDirectory(behaviorPacksUri);
        if (!packs.length) {
            console.warn("ℹ️ Aucun behavior_pack trouvé.");
            return [];
        }
        const behaviorPacks = [];
        for (const [packName, type] of packs) {
            if (type !== vscode.FileType.Directory) continue;

            const packUri = vscode.Uri.joinPath(behaviorPacksUri, packName);
            const packExists = await pathExists(packUri);
            if (!packExists) continue;

            behaviorPacks.push(packUri.fsPath);
        }

        return behaviorPacks;
    }

    private static async getVanillaResourcePacks() {
        const programFiles = process.env.PROGRAMFILES;
        if (!programFiles) {
            console.warn("❌ Impossible de déterminer le dossier Program Files.");
            return [];
        }

        const windowsAppsPath = path.join(programFiles, "WindowsApps");
        const windowsAppsUri = vscode.Uri.file(windowsAppsPath);
        const windowsAppsEntries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

        const minecraftEntry = windowsAppsEntries.find(([name, type]) =>
            type === vscode.FileType.Directory &&
            name.startsWith("Microsoft.MinecraftUWP_") &&
            name.includes("_x64__8wekyb3d8bbwe")
        );
        if (!minecraftEntry) {
            console.warn("❌ Dossier Minecraft UWP introuvable dans WindowsApps.");
            return [];
        }

        const resourcePacksPath = path.join(
            windowsAppsPath,
            minecraftEntry[0],
            "data",
            "resource_packs"
        );
        const resourcePacksUri = vscode.Uri.file(resourcePacksPath);

        const packs = await vscode.workspace.fs.readDirectory(resourcePacksUri);
        if (!packs.length) {
            console.warn("ℹ️ Aucun resource_pack trouvé.");
            return [];
        }
        const resourcePacks = [];
        for (const [packName, type] of packs) {
            if (type !== vscode.FileType.Directory) continue;

            const packUri = vscode.Uri.joinPath(resourcePacksUri, packName);
            const packExists = await pathExists(packUri);
            if (!packExists) continue;

            resourcePacks.push(packUri.fsPath);
        }

        return resourcePacks;
    }

    static async getAimAssistCategoriesFilesBP() {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const aimAssistCategoriesFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const aimAssistCategoriesFile = vscode.Uri.file(path.join(packPath, "aim_assist", "categories", "categories.json"));
            const exists = await pathExists(aimAssistCategoriesFile);
            if (exists) {
                aimAssistCategoriesFiles.push(aimAssistCategoriesFile);
            }
        }
        return aimAssistCategoriesFiles;
    }

    static async getAimAssistPresetFilesBP() {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const aimAssistPresetFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const aimAssistPresetsDir = vscode.Uri.file(path.join(packPath, "aim_assist", "presets"));
            const exists = await pathExists(aimAssistPresetsDir);
            if (!exists) continue;

            await collectJsonFiles(aimAssistPresetsDir, aimAssistPresetFiles);
        }
        return aimAssistPresetFiles;
    }

    static async getBiomeFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const biomeFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const biomesDir = vscode.Uri.file(path.join(packPath, "biomes"));
            const exists = await pathExists(biomesDir);
            if (!exists) continue;

            await collectJsonFiles(biomesDir, biomeFiles);
        }
        return biomeFiles;
    }

    static async getCameraPresetFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const cameraPresetFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const cameraPresetsDir = vscode.Uri.file(path.join(packPath, "cameras", "presets"));
            const exists = await pathExists(cameraPresetsDir);
            if (!exists) continue;

            await collectJsonFiles(cameraPresetsDir, cameraPresetFiles);
        }
        return cameraPresetFiles;
    }

    static async getCraftingItemCatalogFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const craftingItemCatalogFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const craftingItemCatalogFile = vscode.Uri.file(path.join(packPath, "item_catalog", "crafting_item_catalog.json"));
            const exists = await pathExists(craftingItemCatalogFile);
            if (exists) {
                craftingItemCatalogFiles.push(craftingItemCatalogFile);
            }
        }
        return craftingItemCatalogFiles;
    }

    static async getFeatureFilesBP(): Promise<vscode.Uri[]> {
        const definitionsPath = await this.getDefinitionsPath();
        const behaviorPacks = [...await this.getVanillaBehaviorPacks(), ...definitionsPath];
        const featureFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const featuresDir = vscode.Uri.file(path.join(packPath, "features"));
            const exists = await pathExists(featuresDir);
            if (!exists) continue;

            await collectJsonFiles(featuresDir, featureFiles);
        }
        return featureFiles;
    }
    
    static async getFeatureRulesFilesBP(): Promise<vscode.Uri[]> {
        const definitionsPath = await this.getDefinitionsPath();

        const behaviorPacks = [...await this.getVanillaBehaviorPacks(), ...definitionsPath];
        const featureRulesFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const featureRulesDir = vscode.Uri.file(path.join(packPath, "feature_rules"));
            const exists = await pathExists(featureRulesDir);
            if (!exists) continue;

            await collectJsonFiles(featureRulesDir, featureRulesFiles);
        }
        return featureRulesFiles;
    }

    static async getItemFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const itemFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const itemsDir = vscode.Uri.file(path.join(packPath, "items"));
            const exists = await pathExists(itemsDir);
            if (!exists) continue;

            await collectJsonFiles(itemsDir, itemFiles);
        }
        return itemFiles;
    }

    static async getJigsawStructureFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const jigsawStructureFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const jigsawStructuresDir = vscode.Uri.file(path.join(packPath, "worldgen", "structures"));
            const exists = await pathExists(jigsawStructuresDir);
            if (!exists) continue;

            await collectJsonFiles(jigsawStructuresDir, jigsawStructureFiles);
        }
        return jigsawStructureFiles;
    }

    static async getLootTableFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const lootTableFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const lootTablesDir = vscode.Uri.file(path.join(packPath, "loot_tables"));
            const exists = await pathExists(lootTablesDir);
            if (!exists) continue;

            await collectJsonFiles(lootTablesDir, lootTableFiles);
        }
        return lootTableFiles;
    }

    static async getProcessorFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const processorFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const processorsDir = vscode.Uri.file(path.join(packPath, "worldgen", "processors"));
            const exists = await pathExists(processorsDir);
            if (!exists) continue;

            await collectJsonFiles(processorsDir, processorFiles);
        }
        return processorFiles;
    }

    static async getModelFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const modelFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const modelsDir = vscode.Uri.file(path.join(packPath, "models"));
            const exists = await pathExists(modelsDir);
            if (!exists) continue;

            await collectJsonFiles(modelsDir, modelFiles);
        }
        return modelFiles;
    }

    static async getRecipeFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const recipeFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const recipesDir = vscode.Uri.file(path.join(packPath, "recipes"));
            const exists = await pathExists(recipesDir);
            if (!exists) continue;

            await collectJsonFiles(recipesDir, recipeFiles);
        }
        return recipeFiles;
    }

    static async getSpawnRuleFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const spawnRuleFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const spawnRulesDir = vscode.Uri.file(path.join(packPath, "spawn_rules"));
            const exists = await pathExists(spawnRulesDir);
            if (!exists) continue;

            await collectJsonFiles(spawnRulesDir, spawnRuleFiles);
        }
        return spawnRuleFiles;
    }

    static async getStructureSetFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const structureSetFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const structureSetsDir = vscode.Uri.file(path.join(packPath, "worldgen", "structure_sets"));
            const exists = await pathExists(structureSetsDir);
            if (!exists) continue;

            await collectJsonFiles(structureSetsDir, structureSetFiles);
        }
        return structureSetFiles;
    }

    static async getTemplatePoolFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPacks = await this.getVanillaBehaviorPacks();
        const templatePoolFiles: vscode.Uri[] = [];
        for (const packPath of behaviorPacks) {
            const templatePoolsDir = vscode.Uri.file(path.join(packPath, "worldgen", "template_pools"));
            const exists = await pathExists(templatePoolsDir);
            if (!exists) continue;

            await collectJsonFiles(templatePoolsDir, templatePoolFiles);
        }
        return templatePoolFiles;
    }

    static async getAnimationControllerFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const animationControllerFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const animationControllersDir = vscode.Uri.file(path.join(packPath, "animation_controllers"));
            const exists = await pathExists(animationControllersDir);
            if (!exists) continue;

            await collectJsonFiles(animationControllersDir, animationControllerFiles);
        }
        return animationControllerFiles;
    }

    static async getAnimationFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const animationFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const animationsDir = vscode.Uri.file(path.join(packPath, "animations"));
            const exists = await pathExists(animationsDir);
            if (!exists) continue;

            await collectJsonFiles(animationsDir, animationFiles);
        }
        return animationFiles;
    }

    static async getAtmosphereSettingsFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const atmosphereSettingsFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const atmosphericsFolder = vscode.Uri.file(path.join(packPath, "atmospherics"));
            const exists = await pathExists(atmosphericsFolder);
            if (!exists) continue;
            await collectJsonFiles(atmosphericsFolder, atmosphereSettingsFiles);
        }
        return atmosphereSettingsFiles;
    }

    static async getAttachableFilesRP(): Promise<vscode.Uri[]> {
        const definitionsPath = await this.getDefinitionsPath();
        const resourcePacks = [...await this.getVanillaResourcePacks(), ...definitionsPath];
        const attachableFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const attachablesDir = vscode.Uri.file(path.join(packPath, "attachables"));
            const exists = await pathExists(attachablesDir);
            if (!exists) continue;

            await collectJsonFiles(attachablesDir, attachableFiles);
        }
        return attachableFiles;
    }

    static async getColorGradingFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const colorGradingFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const colorGradingDir = vscode.Uri.file(path.join(packPath, "color_grading"));
            const exists = await pathExists(colorGradingDir);
            if (!exists) continue;

            await collectJsonFiles(colorGradingDir, colorGradingFiles);
        }
        return colorGradingFiles;
    }

    static async getFogFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const fogFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const fogsDir = vscode.Uri.file(path.join(packPath, "fogs"));
            const exists = await pathExists(fogsDir);
            if (!exists) continue;

            await collectJsonFiles(fogsDir, fogFiles);
        }
        return fogFiles;
    }

    static async getItemTextureFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const itemTextureFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const texturesDir = vscode.Uri.file(path.join(packPath, "textures", "item_texture.json"));
            const exists = await pathExists(texturesDir);
            if (!exists) continue;

            await collectJsonFiles(texturesDir, itemTextureFiles);
        }
        return itemTextureFiles;
    }

    static async getLightingSettingsFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const lightingSettingsFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const lightingSettingsDir = vscode.Uri.file(path.join(packPath, "lighting"));
            const exists = await pathExists(lightingSettingsDir);
            if (!exists) continue;

            await collectJsonFiles(lightingSettingsDir, lightingSettingsFiles);
        }
        return lightingSettingsFiles;
    }

    static async getParticleEffectFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const particleEffectFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const particlesDir = vscode.Uri.file(path.join(packPath, "particles"));
            const exists = await pathExists(particlesDir);
            if (!exists) continue;

            await collectJsonFiles(particlesDir, particleEffectFiles);
        }
        return particleEffectFiles;
    }

    static async getRenderControllerFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const renderControllerFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const renderControllersDir = vscode.Uri.file(path.join(packPath, "render_controllers"));
            const exists = await pathExists(renderControllersDir);
            if (!exists) continue;

            await collectJsonFiles(renderControllersDir, renderControllerFiles);
        }
        return renderControllerFiles;
    }

    static async getTerrainTextureFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const terrainTextureFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const texturesDir = vscode.Uri.file(path.join(packPath, "textures", "terrain_texture.json"));
            const exists = await pathExists(texturesDir);
            if (exists) {
                terrainTextureFiles.push(texturesDir);
            }
        }
        return terrainTextureFiles;
    }

    static async getTextureFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const textureFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const texturesDir = vscode.Uri.file(path.join(packPath, "textures"));
            const exists = await pathExists(texturesDir);
            if (!exists) continue;

            await collectFiles(texturesDir, textureFiles, [".tga", ".png", ".jpg", ".jpeg"]);
        }
        return textureFiles;
    }

    static async getWaterSettingsFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getVanillaResourcePacks();
        const waterSettingsFiles: vscode.Uri[] = [];
        for (const packPath of resourcePacks) {
            const waterSettingsDir = vscode.Uri.file(path.join(packPath, "water"));
            const exists = await pathExists(waterSettingsDir);
            if (!exists) continue;

            await collectJsonFiles(waterSettingsDir, waterSettingsFiles);
        }
        return waterSettingsFiles;
    }
}

export class GetMinecraftProjectFiles {
    private static async getBehaviorPackUris(): Promise<vscode.Uri[]> {
        if (!(await isMinecraftProject())) return [];
        if (!vscode.workspace.workspaceFolders) return [];

        const projectRoot = vscode.workspace.workspaceFolders[0].uri;
        const behaviorPackUri = vscode.Uri.joinPath(projectRoot, "addon", "behavior_pack");
        if (await pathExists(behaviorPackUri)) {
            return [behaviorPackUri];
        }
        return [];
    }

    private static async getResourcePackUris(): Promise<vscode.Uri[]> {
        if (!(await isMinecraftProject())) return [];
        if (!vscode.workspace.workspaceFolders) return [];

        const projectRoot = vscode.workspace.workspaceFolders[0].uri;
        const resourcePackUri = vscode.Uri.joinPath(projectRoot, "addon", "resource_pack");
        if (await pathExists(resourcePackUri)) {
            return [resourcePackUri];
        }
        return [];
    }

    static async getAimAssistCategoriesFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const aimAssistCategoriesFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const aimAssistCategoriesFile = vscode.Uri.joinPath(behaviorPackUri, "aim_assist", "categories", "categories.json");
            const exists = await pathExists(aimAssistCategoriesFile);
            if (exists) {
                aimAssistCategoriesFiles.push(aimAssistCategoriesFile);
            }
        }
        return aimAssistCategoriesFiles;
    }

    static async getAimAssistPresetFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const aimAssistPresetFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const aimAssistPresetsDir = vscode.Uri.joinPath(behaviorPackUri, "aim_assist", "presets");
            const exists = await pathExists(aimAssistPresetsDir);
            if (!exists) continue;

            await collectJsonFiles(aimAssistPresetsDir, aimAssistPresetFiles);
        }
        return aimAssistPresetFiles;
    }

    static async getAnimationControllersFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const animationControllerFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const animationControllersDir = vscode.Uri.joinPath(behaviorPackUri, "animation_controllers");
            const exists = await pathExists(animationControllersDir);
            if (!exists) continue;

            await collectJsonFiles(animationControllersDir, animationControllerFiles);
        }
        return animationControllerFiles;
    }

    static async getAnimationsFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const animationFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const animationsDir = vscode.Uri.joinPath(behaviorPackUri, "animations");
            const exists = await pathExists(animationsDir);
            if (!exists) continue;

            await collectJsonFiles(animationsDir, animationFiles);
        }
        return animationFiles;
    }

    static async getBiomeFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const biomeFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const biomesDir = vscode.Uri.joinPath(behaviorPackUri, "biomes");
            const exists = await pathExists(biomesDir);
            if (!exists) continue;

            await collectJsonFiles(biomesDir, biomeFiles);
        }
        return biomeFiles;
    }

    static async getBlockFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const blockFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const blocksDir = vscode.Uri.joinPath(behaviorPackUri, "blocks");
            const exists = await pathExists(blocksDir);
            if (!exists) continue;

            await collectJsonFiles(blocksDir, blockFiles);
        }
        return blockFiles;
    }

    static async getCameraPresetFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const cameraPresetFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const cameraPresetsDir = vscode.Uri.joinPath(behaviorPackUri, "cameras", "presets");
            const exists = await pathExists(cameraPresetsDir);
            if (!exists) continue;

            await collectJsonFiles(cameraPresetsDir, cameraPresetFiles);
        }
        return cameraPresetFiles;
    }

    static async getDialogueFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const dialogueFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const dialoguesDir = vscode.Uri.joinPath(behaviorPackUri, "dialogue");
            const exists = await pathExists(dialoguesDir);
            if (!exists) continue;

            await collectJsonFiles(dialoguesDir, dialogueFiles);
        }
        return dialogueFiles;
    }

    static async getDimensionFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const dimensionFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const dimensionsDir = vscode.Uri.joinPath(behaviorPackUri, "dimensions");
            const exists = await pathExists(dimensionsDir);
            if (!exists) continue;

            await collectJsonFiles(dimensionsDir, dimensionFiles);
        }
        return dimensionFiles;
    }

    static async getEntityFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const entityFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const entitiesDir = vscode.Uri.joinPath(behaviorPackUri, "entities");
            const exists = await pathExists(entitiesDir);
            if (!exists) continue;

            await collectJsonFiles(entitiesDir, entityFiles);
        }
        return entityFiles;
    }

    static async getFeatureRulesFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const featureRulesFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const featureRulesDir = vscode.Uri.joinPath(behaviorPackUri, "feature_rules");
            const exists = await pathExists(featureRulesDir);
            if (!exists) continue;

            await collectJsonFiles(featureRulesDir, featureRulesFiles);
        }
        return featureRulesFiles;
    }

    static async getFeatureFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const featureFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const featuresDir = vscode.Uri.joinPath(behaviorPackUri, "features");
            const exists = await pathExists(featuresDir);
            if (!exists) continue;

            await collectJsonFiles(featuresDir, featureFiles);
        }
        return featureFiles;
    }

    static async getFunctionTickFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const functionTickFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const functionsDir = vscode.Uri.joinPath(behaviorPackUri, "functions");
            const exists = await pathExists(functionsDir);
            if (!exists) continue;

            const tickFile = vscode.Uri.joinPath(functionsDir, "tick.json");
            const tickFileExists = await pathExists(tickFile);
            if (tickFileExists) {
                functionTickFiles.push(tickFile);
            }
        }
        return functionTickFiles;
    }

    static async getCraftingItemCatalogFilesBP(): Promise<vscode.Uri[]> {
        const craftingItemCatalogFiles: vscode.Uri[] = [];
        const behaviorPackUris = await this.getBehaviorPackUris();
        for (const behaviorPackUri of behaviorPackUris) {
            const itemCatalogDir = vscode.Uri.joinPath(behaviorPackUri, "item_catalog");
            const exists = await pathExists(itemCatalogDir);
            if (!exists) continue;

            const craftingItemCatalogFile = vscode.Uri.joinPath(itemCatalogDir, "crafting_item_catalog.json");
            const fileExists = await pathExists(craftingItemCatalogFile);
            if (fileExists) {
                craftingItemCatalogFiles.push(craftingItemCatalogFile);
            }
        }
        return craftingItemCatalogFiles;
    }

    static async getItemFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const itemFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const itemsDir = vscode.Uri.joinPath(behaviorPackUri, "items");
            const exists = await pathExists(itemsDir);
            if (!exists) continue;

            await collectJsonFiles(itemsDir, itemFiles);
        }
        return itemFiles;
    }

    static async getLootTableFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const lootTableFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const lootTablesDir = vscode.Uri.joinPath(behaviorPackUri, "loot_tables");
            const exists = await pathExists(lootTablesDir);
            if (!exists) continue;

            await collectJsonFiles(lootTablesDir, lootTableFiles);
        }
        return lootTableFiles;
    }

    static async getRecipeFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const recipeFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const recipesDir = vscode.Uri.joinPath(behaviorPackUri, "recipes");
            const exists = await pathExists(recipesDir);
            if (!exists) continue;

            await collectJsonFiles(recipesDir, recipeFiles);
        }
        return recipeFiles;
    }

    static async getSpawnRulesFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const spawnRulesFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const spawnRulesDir = vscode.Uri.joinPath(behaviorPackUri, "spawn_rules");
            const exists = await pathExists(spawnRulesDir);
            if (!exists) continue;

            await collectJsonFiles(spawnRulesDir, spawnRulesFiles);
        }
        return spawnRulesFiles;
    }

    static async getLanguagesFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const languageFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const textsFolder = vscode.Uri.joinPath(behaviorPackUri, "texts");
            const exists = await pathExists(textsFolder);
            if (!exists) continue;
            const languagesFile = vscode.Uri.joinPath(textsFolder, "languages.json");
            const fileExists = await pathExists(languagesFile);
            if (fileExists) {
                languageFiles.push(languagesFile);
            }
        }
        return languageFiles;
    }

    static async getTradingFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const tradingFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const tradingDir = vscode.Uri.joinPath(behaviorPackUri, "trading");
            const exists = await pathExists(tradingDir);
            if (!exists) continue;

            await collectJsonFiles(tradingDir, tradingFiles);
        }
        return tradingFiles;
    }

    static async getJigsawStructureFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const jigsawStructureFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const jigsawStructuresDir = vscode.Uri.joinPath(behaviorPackUri, "worldgen", "jigsaw_structures");
            const exists = await pathExists(jigsawStructuresDir);
            if (!exists) continue;

            await collectJsonFiles(jigsawStructuresDir, jigsawStructureFiles);
        }
        return jigsawStructureFiles;
    }

    static async getProcessorFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const processorFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const processorsDir = vscode.Uri.joinPath(behaviorPackUri, "worldgen", "processors");
            const exists = await pathExists(processorsDir);
            if (!exists) continue;

            await collectJsonFiles(processorsDir, processorFiles);
        }
        return processorFiles;
    }

    static async getStructureSetFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const structureSetFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const structureSetsDir = vscode.Uri.joinPath(behaviorPackUri, "worldgen", "structure_sets");
            const exists = await pathExists(structureSetsDir);
            if (!exists) continue;

            collectJsonFiles(structureSetsDir, structureSetFiles);
        }
        return structureSetFiles;
    }

    static async getTemplatePoolFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const templatePoolFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const templatePoolsDir = vscode.Uri.joinPath(behaviorPackUri, "worldgen", "template_pools");
            const exists = await pathExists(templatePoolsDir);
            if (!exists) continue;

            await collectJsonFiles(templatePoolsDir, templatePoolFiles);
        }
        return templatePoolFiles;
    }

    static async getContentsFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const contentsFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const contentsFile = vscode.Uri.joinPath(behaviorPackUri, "contents.json");
            const exists = await pathExists(contentsFile);
            if (exists) {
                contentsFiles.push(contentsFile);
            }
        }
        return contentsFiles;
    }

    static async getManifestFilesBP(): Promise<vscode.Uri[]> {
        const behaviorPackUris = await this.getBehaviorPackUris();
        const manifestFiles: vscode.Uri[] = [];
        for (const behaviorPackUri of behaviorPackUris) {
            const manifestFile = vscode.Uri.joinPath(behaviorPackUri, "manifest.json");
            const exists = await pathExists(manifestFile);
            if (exists) {
                manifestFiles.push(manifestFile);
            }
        }
        return manifestFiles;
    }

    
    static async getAnimationControllerFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const animationControllerFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const animationControllersDir = vscode.Uri.joinPath(resourcePackUri, "animation_controllers");
            const exists = await pathExists(animationControllersDir);
            if (!exists) continue;

            await collectJsonFiles(animationControllersDir, animationControllerFiles);
        }
        return animationControllerFiles;
    }

    static async getAnimationFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const animationFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const animationsDir = vscode.Uri.joinPath(resourcePackUri, "animations");
            const exists = await pathExists(animationsDir);
            if (!exists) continue;

            await collectJsonFiles(animationsDir, animationFiles);
        }
        return animationFiles;
    }

    static async getAtmosphereSettingsFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const atmosphereSettingsFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const atmosphericsFolder = vscode.Uri.joinPath(resourcePackUri, "atmospherics");
            const exists = await pathExists(atmosphericsFolder);
            if (!exists) continue;

            await collectJsonFiles(atmosphericsFolder, atmosphereSettingsFiles);
        }
        return atmosphereSettingsFiles;
    }

    static async getBlockCullingRulesFilesRP(): Promise<vscode.Uri[]> {
        const resourcePacks = await this.getResourcePackUris();
        const blockCullingRulesFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePacks) {
            const blockCullingRulesDir = vscode.Uri.joinPath(resourcePackUri, "block_culling");
            const exists = await pathExists(blockCullingRulesDir);
            if (!exists) continue;

            await collectJsonFiles(blockCullingRulesDir, blockCullingRulesFiles);
        }
        return blockCullingRulesFiles;
    }

    static async getColorGradingFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const colorGradingFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const colorGradingDir = vscode.Uri.joinPath(resourcePackUri, "color_grading");
            const exists = await pathExists(colorGradingDir);
            if (!exists) continue;

            await collectJsonFiles(colorGradingDir, colorGradingFiles);
        }
        return colorGradingFiles;
    }

    static async getFogFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const fogFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const fogsDir = vscode.Uri.joinPath(resourcePackUri, "fogs");
            const exists = await pathExists(fogsDir);
            if (!exists) continue;

            await collectJsonFiles(fogsDir, fogFiles);
        }
        return fogFiles;
    }

    static async getItemTextureFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const itemTextureFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const itemTextureFile = vscode.Uri.joinPath(resourcePackUri, "textures", "item_texture.json");
            const exists = await pathExists(itemTextureFile);
            if (!exists) continue;

            itemTextureFiles.push(itemTextureFile);
        }
        return itemTextureFiles;
    }

    static async getLightingSettingsFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const lightingSettingsFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const lightingSettingsDir = vscode.Uri.joinPath(resourcePackUri, "lighting");
            const exists = await pathExists(lightingSettingsDir);
            if (!exists) continue;

            await collectJsonFiles(lightingSettingsDir, lightingSettingsFiles);
        }
        return lightingSettingsFiles;
    }

    static async getModelFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const modelFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const modelsDir = vscode.Uri.joinPath(resourcePackUri, "models");
            const exists = await pathExists(modelsDir);
            if (!exists) continue;

            await collectJsonFiles(modelsDir, modelFiles);
        }
        return modelFiles;
    }

    static async getParticleEffectFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const particleEffectFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const particlesDir = vscode.Uri.joinPath(resourcePackUri, "particles");
            const exists = await pathExists(particlesDir);
            if (!exists) continue;

            await collectJsonFiles(particlesDir, particleEffectFiles);
        }
        return particleEffectFiles;
    }


    static async getRenderControllerFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const renderControllerFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const renderControllersDir = vscode.Uri.joinPath(resourcePackUri, "render_controllers");
            const exists = await pathExists(renderControllersDir);
            if (!exists) continue;

            await collectJsonFiles(renderControllersDir, renderControllerFiles);
        }
        return renderControllerFiles;
    }

    static async getTerrainTextureFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const terrainTextureFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const terrainTextureFile = vscode.Uri.joinPath(resourcePackUri, "textures", "terrain_texture.json");
            const exists = await pathExists(terrainTextureFile);
            if (!exists) continue;

            terrainTextureFiles.push(terrainTextureFile);
        }
        return terrainTextureFiles;
    }

    static async getTextureFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const textureFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const texturesDir = vscode.Uri.joinPath(resourcePackUri, "textures");
            const exists = await pathExists(texturesDir);
            if (!exists) continue;

            await collectFiles(texturesDir, textureFiles, [".tga", ".png", ".jpg", ".jpeg"]);
        }
        return textureFiles;
    }

    static async getWaterSettingsFilesRP(): Promise<vscode.Uri[]> {
        const resourcePackUris = await this.getResourcePackUris();
        const waterSettingsFiles: vscode.Uri[] = [];
        for (const resourcePackUri of resourcePackUris) {
            const waterSettingsDir = vscode.Uri.joinPath(resourcePackUri, "water");
            const exists = await pathExists(waterSettingsDir);
            if (!exists) continue;

            await collectJsonFiles(waterSettingsDir, waterSettingsFiles);
        }
        return waterSettingsFiles;
    }
}