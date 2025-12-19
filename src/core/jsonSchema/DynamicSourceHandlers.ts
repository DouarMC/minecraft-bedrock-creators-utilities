import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { DynamicExamplesSourceKey } from "../../../minecraftSchemas/shared/schemaEnums";
import { MinecraftFileResolverService } from "../minecraft/fileTypes/MinecraftFileResolverService";
import { MinecraftGame } from "../minecraft/games/MinecraftGame";
import { MinecraftGameManager } from "../minecraft/games/MinecraftGameManager";
import { MinecraftProject } from "../project/MinecraftProject";
import { MinecraftProjectManager } from "../project/MinecraftProjectManager";


export class DynamicSourceHandlers {
    public static async getDynamicExampleSourceValues(key: DynamicExamplesSourceKey | Object): Promise<string[]> {
        const exampleValues: string[] = [];
        const minecraftProject = MinecraftProjectManager.project;
        const minecraftGame = minecraftProject
            ? MinecraftGameManager.getMinecraftGameForProject(minecraftProject)
            : undefined;
        const fileSources: (MinecraftGame | MinecraftProject)[] = [];
        if (minecraftGame) {
            fileSources.push(minecraftGame);
        }
        if (minecraftProject) {
            fileSources.push(minecraftProject);
        }

        if (typeof key === "string") {
            switch (key as DynamicExamplesSourceKey) {
                case "aim_assist_category_ids":
                    exampleValues.push(...await this.getAimAssistCategoryIds(fileSources));
                    break;
            }
        } else {

        }

        return Array.from(new Set(exampleValues));
    }

    private static async getFileContent(file: vscode.Uri): Promise<any> {
        const fileData = await vscode.workspace.fs.readFile(file);
        const fileContent = new TextDecoder("utf-8").decode(fileData);
        return JsonParser.parse(fileContent);
    }

    private static async getAimAssistCategoryIds(fileSources: (MinecraftGame | MinecraftProject)[]): Promise<string[]> {
        const aimAssistCategories: string[] = [];

        const files: vscode.Uri[] = [];
        for (const fileSource of fileSources) {
            const resolvedFiles = await MinecraftFileResolverService.getDataDrivenFiles("behavior_pack/aim_assist/categories/categories.json", fileSource);
            files.push(...resolvedFiles);
        }

        for (const file of files) {
            try {
                const json = await this.getFileContent(file);
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
                console.warn(`⚠️ Failed to read or parse aim_assist categories from ${file.toString()}:`, error);
            }
        }

        return aimAssistCategories;
    }
}