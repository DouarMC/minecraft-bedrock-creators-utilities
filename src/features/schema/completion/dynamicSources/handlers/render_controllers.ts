import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenRenderControllerIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const renderControllerIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/render_controllers/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const renderControllers = json?.render_controllers;
            if (typeof renderControllerIds === "object") {
                const renderControllerKeys = Object.keys(renderControllers);
                for (const key of renderControllerKeys) {
                    if (typeof renderControllers[key] === "object") {
                        renderControllerIds.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse render controllers from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(renderControllerIds));
}

export async function getRenderControllerIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const renderControllerIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/render_controllers/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/render_controllers/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const renderControllers = json?.render_controllers;
            if (typeof renderControllerIds === "object") {
                const renderControllerKeys = Object.keys(renderControllers);
                for (const key of renderControllerKeys) {
                    if (typeof renderControllers[key] === "object") {
                        renderControllerIds.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse render controllers from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(renderControllerIds));
}