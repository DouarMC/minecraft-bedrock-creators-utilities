import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenFeatureRulesIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const featureRuleIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/feature_rules/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:feature_rules"]?.description?.identifier;
            if (typeof id === "string") {
                featureRuleIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse feature_rule from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(featureRuleIds));
}