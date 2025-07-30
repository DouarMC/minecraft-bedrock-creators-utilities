import * as vscode from "vscode";
import { VANILLA_AIM_ASSIST_PRESET_IDS, VANILLA_BIOMES_IDS, VANILLA_BIOMES_TAGS, VANILLA_BLOCK_IDS, VANILLA_CAMERA_PRESETS_IDS, VANILLA_COOLDOWN_CATEGORY_IDS, VANILLA_DATA_DRIVEN_ITEM_IDS, VANILLA_DIMENSION_IDS, VANILLA_EFFECT_IDS, VANILLA_ENTITY_IDS, VANILLA_ITEM_GROUP_IDS, VANILLA_ITEM_IDS, VANILLA_ITEM_TAGS, VANILLA_ENTITY_FAMILY_IDS } from "../data/vanillaMinecraftIdentifiers";

export async function getBlockIds(): Promise<string[]> {
    const vanillaBlockIds = VANILLA_BLOCK_IDS;

    const uris = await vscode.workspace.findFiles('**/addon/behavior_pack/blocks/**/*.json');
    const customBlockIds: string[] = [];

    for (const uri of uris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder('utf-8').decode(fileData);
            const json = JSON.parse(content);

            const id = json?.["minecraft:block"]?.description?.identifier;
            if (typeof id === "string") {
                customBlockIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);
        }
    }

    return Array.from(new Set([...vanillaBlockIds, ...customBlockIds]));
}

export async function getItemIds(): Promise<string[]> {
    const vanillaItemIds = VANILLA_ITEM_IDS;
    const uris = await vscode.workspace.findFiles('**/addon/behavior_pack/items/**/*.json');
    const customItemIds: string[] = [];
    for (const uri of uris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder('utf-8').decode(fileData);
            const json = JSON.parse(content);

            const id = json?.["minecraft:item"]?.description?.identifier;
            if (typeof id === "string") {
                customItemIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);
        }
    }
    return Array.from(new Set([...vanillaItemIds, ...customItemIds]));
}

export async function getEntityIds(): Promise<string[]> {
    const vanillaEntityIds = VANILLA_ENTITY_IDS;

    const vanillaEntityIdsWithoutNamespace = vanillaEntityIds.map(id =>
        id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
    );

    const uris = await vscode.workspace.findFiles('**/addon/behavior_pack/entities/**/*.json');
    const customEntityIds: string[] = [];
    for (const uri of uris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder('utf-8').decode(fileData);
            const json = JSON.parse(content);

            const id = json?.["minecraft:entity"]?.description?.identifier;
            if (typeof id === "string") {
                customEntityIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);
        }
    }
    
    return Array.from(new Set([...vanillaEntityIds, ...vanillaEntityIdsWithoutNamespace, ...customEntityIds]));
}

export async function getDataDrivenEntityIds(): Promise<string[]> {
    return VANILLA_ENTITY_IDS;
}

export async function getLootTablePaths(): Promise<string[]> {
    const uris = await vscode.workspace.findFiles(
        "**/addon/behavior_pack/loot_tables/**/*.json",
        "**/node_modules/**"
    );
    const result: string[] = [];

    for (const uri of uris) {
        const relativePath = getLootTableRelativePath(uri);
        if (relativePath) {
            result.push(relativePath);
        }
    }

    return result;
}

function getLootTableRelativePath(uri: vscode.Uri): string | null {
    const match = /.*[\/\\]addon[\/\\]behavior_pack[\/\\](loot_tables[\/\\].+\.json)$/i.exec(uri.fsPath);
    if (!match) {return null;}

    // Uniformise les slashs pour être cross-platform
    return match[1].replace(/\\/g, '/');
}

export async function getBlockModelIds(): Promise<string[]> {
    return ["minecraft:geometry.full_block", "minecraft:geometry.cross"];
}

export async function getCraftingRecipeTagIds(): Promise<string[]> {
    return ["crafting_table", "stonecutter"];
}

export async function getCullingLayerIds(): Promise<string[]> {
    return ["minecraft:culling_layer.undefined", "minecraft:culling_layer.leaves"];
}

export async function getAimAssistCategoryIds(): Promise<string[]> {
    return ["minecraft:bucket", "minecraft:empty_hand", "minecraft:default"];
}

export async function getAimAssistPresetIds(): Promise<string[]> {
    const vanillaAimAssistPresetIds = VANILLA_AIM_ASSIST_PRESET_IDS;
    const uris = await vscode.workspace.findFiles('**/addon/behavior_pack/aim_assist/presets/**/*.json');
    const customAimAssistPresetIds: string[] = [];
    for (const uri of uris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder('utf-8').decode(fileData);
            const json = JSON.parse(content);

            const id = json?.["minecraft:aim_assist_preset"]?.description?.identifier;
            if (typeof id === "string") {
                customAimAssistPresetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);
        }
    }

    return Array.from(new Set([...vanillaAimAssistPresetIds, ...customAimAssistPresetIds]));
}

export async function getBiomeIds(): Promise<string[]> {
    const vanillaBiomeIds = VANILLA_BIOMES_IDS.map(id =>
        id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
    );

    const uris = await vscode.workspace.findFiles('**/addon/behavior_pack/biomes/**/*.json');
    const customBiomeIds: string[] = [];
    for (const uri of uris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder('utf-8').decode(fileData);
            const json = JSON.parse(content);

            const id = json?.["minecraft:biome"]?.description?.identifier;
            if (typeof id === "string") {
                customBiomeIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);
        }
    }

    return Array.from(new Set([...vanillaBiomeIds, ...customBiomeIds]));
}

export async function getBiomeTags(): Promise<string[]> {
    const vanillaBiomeTags = VANILLA_BIOMES_TAGS;
    return vanillaBiomeTags;
}

export async function getItemGroupIds(): Promise<string[]> {
    const vanillaItemGroupIds = VANILLA_ITEM_GROUP_IDS;
    return vanillaItemGroupIds;
}

export async function getItemGroupIdsWithMinecraftNamespace(): Promise<string[]> {
    const vanillaItemGroupIds = VANILLA_ITEM_GROUP_IDS.map(id =>
        id.startsWith("minecraft:") ? id : `minecraft:${id}`
    );
    return vanillaItemGroupIds;
}

export async function getDataDrivenItemIds(): Promise<string[]> {
    return VANILLA_DATA_DRIVEN_ITEM_IDS;
}

export async function getEffectIds(): Promise<string[]> {
    const vanillaEffectIds = VANILLA_EFFECT_IDS.map(id =>
        id.startsWith("minecraft:") ? id.slice("minecraft:".length) : id
    );
    return vanillaEffectIds;
}

export async function getCooldownCategoryIds(): Promise<string[]> {
    const vanillaCooldownCategoryIds = VANILLA_COOLDOWN_CATEGORY_IDS;
    return vanillaCooldownCategoryIds;
}

export async function getItemTags(): Promise<string[]> {
    const vanillaItemTags = VANILLA_ITEM_TAGS;
    return vanillaItemTags;
}

export const getCameraPresetIds = async (): Promise<string[]> => {
    const vanillaCameraPresetIds = VANILLA_CAMERA_PRESETS_IDS;

    const uris = await vscode.workspace.findFiles('**/addon/behavior_pack/cameras/presets/**/*.json');
    const customCameraPresetIds: string[] = [];
    for (const uri of uris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder('utf-8').decode(fileData);
            const json = JSON.parse(content);

            const id = json?.["minecraft:camera_preset"]?.description?.identifier;
            if (typeof id === "string") {
                customCameraPresetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);
        }
    }

    return Array.from(new Set([...vanillaCameraPresetIds, ...customCameraPresetIds]));
};

export async function getDimensionIds(): Promise<string[]> {
    return VANILLA_DIMENSION_IDS;
}

export async function getEntityFamilyIds(): Promise<string[]> {
    return VANILLA_ENTITY_FAMILY_IDS;
}