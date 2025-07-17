import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { findBlockFilesInWorkspace, findLootTableFilesInWorkspace } from "./workspaceUtils";
import * as vscode from "vscode";

export async function getAllBlockIdentifiers(): Promise<string[]> {
    const vanillaBlockIds = Object.values(MinecraftBlockTypes);
    const uris = await findBlockFilesInWorkspace();
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

export async function getAllLootTablePaths(): Promise<string[]> {
    const uris = await findLootTableFilesInWorkspace();
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

export async function getAllBlockModelIds(): Promise<string[]> {
    return ["minecraft:geometry.full_block", "minecraft:geometry.cross"];
}

export async function getCraftingRecipeTags(): Promise<string[]> {
    return ["crafting_table", "stonecutter"];
}

export async function getCullingLayers(): Promise<string[]> {
    return ["minecraft:culling_layer.undefined", "minecraft:culling_layer.leaves"];
}