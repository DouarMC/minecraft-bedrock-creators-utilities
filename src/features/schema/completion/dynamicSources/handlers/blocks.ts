import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_BLOCK_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getBlockIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const blockIds: string[] = [];
    const vanillaBlocks = VANILLA_BLOCK_IDS;

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/blocks/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/blocks/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:block"]?.description?.identifier;
            if (typeof id === "string") {
                blockIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse block from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set([...blockIds, ...vanillaBlocks]));
}

export async function getVanillaBlockIdsWithoutNamespace(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const vanillaBlockIds = VANILLA_BLOCK_IDS;
    const blockIdsWithoutNamespace = vanillaBlockIds
        .filter(id => id.startsWith("minecraft:"))
        .map(id => id.replace("minecraft:", ""));
    
    return Array.from(new Set(blockIdsWithoutNamespace));
}