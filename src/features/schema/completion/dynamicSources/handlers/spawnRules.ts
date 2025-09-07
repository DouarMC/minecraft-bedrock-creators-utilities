import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenSpawnRulesIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const spawnRulesIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/spawn_rules/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:spawn_rules"]?.description?.identifier;
            if (typeof id === "string") {
                spawnRulesIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse spawn_rule from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(spawnRulesIds));
}