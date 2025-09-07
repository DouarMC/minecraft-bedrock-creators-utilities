import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getAimAssistCategoryIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const aimAssistCategories: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/aim_assist/categories/categories.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/aim_assist/categories/categories.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const categories = json?.["minecraft:aim_assist_categories"]?.categories;
            if (Array.isArray(categories)) {
                for (const category of categories) {
                    const id = category?.name;
                    if (typeof id === "string") {
                        aimAssistCategories.push(id);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse aim_assist categories from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(aimAssistCategories));
}

export async function getDataDrivenAimAssistCategoryIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const dataDrivenAimAssistCategories: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/aim_assist/categories/categories.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const categories = json?.["minecraft:aim_assist_categories"]?.categories;
            if (Array.isArray(categories)) {
                for (const category of categories) {
                    const id = category?.name;
                    if (typeof id === "string") {
                        dataDrivenAimAssistCategories.push(id);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse aim_assist categories from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(dataDrivenAimAssistCategories));
}