import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getAtmosphereSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const atmosphereSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/atmospherics/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/atmospherics/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:atmosphere_settings"]?.description?.identifier;
            if (typeof id === "string") {
                atmosphereSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse atmosphere settings from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(atmosphereSettingsIds));
}

export async function getDataDrivenAtmosphereSettingsIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const dataDrivenAtmosphereSettingsIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/atmospherics/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:atmosphere_settings"]?.description?.identifier;
            if (typeof id === "string") {
                dataDrivenAtmosphereSettingsIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse atmosphere settings from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(dataDrivenAtmosphereSettingsIds));
}