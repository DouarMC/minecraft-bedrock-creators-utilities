import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { DynamicExamplesSourceKey } from "../../../minecraftSchemas/shared/schemaEnums";
import { MinecraftFileResolverService } from "../minecraft/fileTypes/MinecraftFileResolverService";
import { MinecraftGame } from "../minecraft/games/MinecraftGame";
import { MinecraftGameManager } from "../minecraft/games/MinecraftGameManager";
import { MinecraftProject } from "../project/MinecraftProject";
import { MinecraftProjectManager } from "../project/MinecraftProjectManager";
import { MinecraftFileId } from "../minecraft/fileTypes/MinecraftFileId";
import { SCHEMA_BASE_URL } from "../../constants";


export class DynamicSourceHandlers {
    public static async getDynamicExampleSourceValues(key: DynamicExamplesSourceKey | Object): Promise<string[]> {
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

        if (typeof key === "string") {
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
                case "data_driven_aim_assist_category_ids":
                    exampleValues.push(...await this.getAimAssistCategoryIds(fileSourcesAvailable.filter(source => source instanceof MinecraftProject)));
                    break;

            }
        } else {

        }

        return Array.from(new Set(exampleValues));
    }

    private static async getVanillaIdentifiersDist(): Promise<any> {
        const vanillaDistFile = await fetch(SCHEMA_BASE_URL + "minecraftVanillaIdentifiers/stable.json");
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
        const blockIds: string[] = [(await this.getVanillaIdentifiersDist()).VANILLA_BLOCK_IDS];
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
}