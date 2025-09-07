import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getResourceAnimationControllerIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const resourceAnimationControllerIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/animation_controllers/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const animationControllers = json?.animation_controllers;
            if (typeof animationControllers === "object") {
                for (const key of Object.keys(animationControllers)) {
                    if (typeof animationControllers[key] === "object") {
                        resourceAnimationControllerIds.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse resource animation controller from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(resourceAnimationControllerIds));
}