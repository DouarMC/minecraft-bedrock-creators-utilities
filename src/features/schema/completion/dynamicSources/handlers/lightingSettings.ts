import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenLightingSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const lightingSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/lighting/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:lighting_settings"]?.description?.identifier;
            if (typeof id === "string") {
                lightingSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse lighting setting from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(lightingSettingsIds));
}