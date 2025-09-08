import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenWaterSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const waterSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/water/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:water_settings"]?.description?.identifier;
            if (typeof id === "string") {
                waterSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse water setting from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(waterSettingsIds));
}

export async function getWaterSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const waterSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/water/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/water/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:water_settings"]?.description?.identifier;
            if (typeof id === "string") {
                waterSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse water setting from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(waterSettingsIds));
}