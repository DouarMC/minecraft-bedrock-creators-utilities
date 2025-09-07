import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getCameraPresetIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const cameraPresetIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/cameras/presets/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/cameras/presets/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:camera_preset"]?.identifier;
            if (typeof id === "string") {
                cameraPresetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse camera preset from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(cameraPresetIds));
}

export async function getDataDrivenCameraPresetIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const cameraPresetIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/cameras/presets/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:camera_preset"]?.identifier;
            if (typeof id === "string") {
                cameraPresetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse camera preset from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(cameraPresetIds));
}

export async function getInheritableCameraPresetIds(document: vscode.TextDocument, schema: MinecraftJsonSchema): Promise<string[]> {
    const cameraPresetIds = await getCameraPresetIds(document, schema);
    return Array.from(new Set(cameraPresetIds));
}