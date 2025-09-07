import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getCraftingRecipeTags(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const craftingRecipeTags: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/recipes/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/recipes/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const minecraftRecipeShapeless = json?.["minecraft:recipe_shapeless"];
            const minecraftRecipeShaped = json?.["minecraft:recipe_shaped"];
            if (minecraftRecipeShapeless && Array.isArray(minecraftRecipeShapeless.tags)) {
                for (const tag of minecraftRecipeShapeless.tags) {
                    if (typeof tag === "string") {
                        craftingRecipeTags.push(tag);
                    }
                }
            }
            if (minecraftRecipeShaped && Array.isArray(minecraftRecipeShaped.tags)) {
                for (const tag of minecraftRecipeShaped.tags) {
                    if (typeof tag === "string") {
                        craftingRecipeTags.push(tag);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse recipe for tags from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(craftingRecipeTags));
}

export async function getDataDrivenRecipeIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const recipeIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/recipes/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const recipeFurnace = json?.["minecraft:recipe_furnace"];
            const recipeBrewingContainer = json?.["minecraft:recipe_brewing_container"];
            const recipeBrewingMix = json?.["minecraft:recipe_brewing_mix"];
            const recipeShaped = json?.["minecraft:recipe_shaped"];
            const recipeShapeless = json?.["minecraft:recipe_shapeless"];
            const recipeSmithingTransform = json?.["minecraft:recipe_smithing_transform"];
            const recipeSmithingTrim = json?.["minecraft:recipe_smithing_trim"];

            if (recipeFurnace && typeof recipeFurnace === "object") {
                const id = recipeFurnace.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
            if (recipeBrewingContainer && typeof recipeBrewingContainer === "object") {
                const id = recipeBrewingContainer.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
            if (recipeBrewingMix && typeof recipeBrewingMix === "object") {
                const id = recipeBrewingMix.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
            if (recipeShaped && typeof recipeShaped === "object") {
                const id = recipeShaped.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
            if (recipeShapeless && typeof recipeShapeless === "object") {
                const id = recipeShapeless.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
            if (recipeSmithingTransform && typeof recipeSmithingTransform === "object") {
                const id = recipeSmithingTransform.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
            if (recipeSmithingTrim && typeof recipeSmithingTrim === "object") {
                const id = recipeSmithingTrim.description?.identifier;
                if (typeof id === "string") {
                    recipeIds.push(id);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse recipe from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(recipeIds));
}