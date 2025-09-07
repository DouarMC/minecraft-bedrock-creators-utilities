import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_COOLDOWN_CATEGORY_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getCooldownCategoryIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const cooldownCategoryIds: string[] = [];
    const vanillaCooldownCategoryIds = VANILLA_COOLDOWN_CATEGORY_IDS;

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/items/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/items/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const cooldownCategory = json?.["minecraft:item"]?.components?.["minecraft:cooldown"]?.category;
            if (typeof cooldownCategory === "string") {
                cooldownCategoryIds.push(cooldownCategory);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item for cooldown category from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set([...cooldownCategoryIds, ...vanillaCooldownCategoryIds]));
}