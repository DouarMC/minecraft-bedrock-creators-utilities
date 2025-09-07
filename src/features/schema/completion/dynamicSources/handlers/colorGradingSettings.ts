import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getColorGradingSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const colorGradingSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/color_grading/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/color_grading/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:color_grading_settings"]?.description?.identifier;
            if (typeof id === "string") {
                colorGradingSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse color grading settings from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(colorGradingSettingsIds));
}

export async function getDataDrivenColorGradingSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const colorGradingSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/color_grading/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:color_grading_settings"]?.description?.identifier;
            if (typeof id === "string") {
                colorGradingSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse color grading settings from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(colorGradingSettingsIds));
}