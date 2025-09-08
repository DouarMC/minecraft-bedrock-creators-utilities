import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenMusicReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const musicIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds/music_definitions.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const keys = Object.keys(json ?? {});
            for (const key of keys) {
                if (typeof json[key] !== "object") continue;
                const eventName = json[key]?.event_name;
                if (typeof eventName === "string") {
                    musicIds.push(eventName);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse music definitions from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(musicIds));
}

export async function getMusicReferences(document: vscode.TextDocument, schema: MinecraftJsonSchema): Promise<string[]> {
    const musicIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds/music_definitions.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/sounds/music_definitions.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const keys = Object.keys(json ?? {});
            for (const key of keys) {
                if (typeof json[key] !== "object") continue;
                const eventName = json[key]?.event_name;
                if (typeof eventName === "string") {
                    musicIds.push(eventName);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse music definitions from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(musicIds));
}