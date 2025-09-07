import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenFogIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const fogIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/fogs/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:fog_settings"]?.description?.identifier;
            if (typeof id === "string") {
                fogIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse fog from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(fogIds));
}

export async function getFogIds(document: vscode.TextDocument, schema: MinecraftJsonSchema): Promise<string[]> {
    const fogIds = await getDataDrivenFogIds(document, schema);

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/fogs/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver?.getDataDrivenFilesFromProject("resource_pack/fogs/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:fog_settings"]?.description?.identifier;
            if (typeof id === "string") {
                fogIds.push(id);
            }
        }
        catch (error) {
            console.warn(`⚠️ Failed to read or parse fog from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(fogIds));
}