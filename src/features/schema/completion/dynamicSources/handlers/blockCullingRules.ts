import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_CULLING_LAYER_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getBlockCullingRulesIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const blockCullingRulesIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/block_culling/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/block_culling/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:block_culling_rules"]?.description?.identifier;
            if (typeof id === "string") {
                blockCullingRulesIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse block culling rules from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(blockCullingRulesIds));
}

export async function getCullingLayerIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const cullingLayerIds: string[] = [];
    const vanillaCullingLayerIds = VANILLA_CULLING_LAYER_IDS;

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/blocks/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/blocks/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const cullingLayer = json?.["minecraft:block"]?.components?.["minecraft:geometry"]?.culling_layer;
            if (typeof cullingLayer === "string") {
                cullingLayerIds.push(cullingLayer);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse block for culling layer from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set([...cullingLayerIds, ...vanillaCullingLayerIds]));
}