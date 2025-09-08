import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenResourceAnimationIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const resourceAnimationIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/animations/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const animations = json?.animations;
            if (typeof animations === "object") {
                for (const key of Object.keys(animations)) {
                    if (typeof animations[key] === "object") {
                        resourceAnimationIds.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse resource animation from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(resourceAnimationIds));
}

export async function getResourceAnimationIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const resourceAnimationIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/animations/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/animations/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const animations = json?.animations;
            if (typeof animations === "object") {
                for (const key of Object.keys(animations)) {
                    if (typeof animations[key] === "object") {
                        resourceAnimationIds.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse resource animation from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(resourceAnimationIds));
}