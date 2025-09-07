import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getAimAssistPresetIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const aimAssistPresetIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/aim_assist/presets/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/aim_assist/presets/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:aim_assist_preset"]?.identifier;
            if (typeof id === "string") {
                aimAssistPresetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse aim_assist preset from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(aimAssistPresetIds));
}

export async function getDataDrivenAimAssistPresetIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const dataDrivenAimAssistPresetIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/aim_assist/presets/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:aim_assist_preset"]?.identifier;
            if (typeof id === "string") {
                dataDrivenAimAssistPresetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse aim_assist preset from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(dataDrivenAimAssistPresetIds));
}