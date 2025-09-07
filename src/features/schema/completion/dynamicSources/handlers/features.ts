import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenFeatureIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const featureIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/features/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

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
                const id = json?.[featureType]?.description?.identifier;
                if (typeof id === "string") {
                    featureIds.push(id);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse feature from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(featureIds));
}

export async function getFeatureIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const featureIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/features/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/features/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

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
                if (typeof feature === "object") {
                    const id = feature?.description?.identifier;
                    if (typeof id === "string") {
                        featureIds.push(id);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse feature from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(featureIds));
}