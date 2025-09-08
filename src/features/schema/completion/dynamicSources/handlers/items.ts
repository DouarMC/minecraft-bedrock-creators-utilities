import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_ITEM_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";
import { compareVersions } from "../../../model/versioning/compareVersions";

export async function getDataDrivenIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const itemIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/items/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:item"]?.description?.identifier;
            if (typeof id === "string") {
                itemIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(itemIds));
}

export async function getItemGroupIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const itemGroupIds: string[] = [];

    const vanillaCraftingItemCatalogUris = await getStableDataManager()?.getFiles("behavior_pack/item_catalog/crafting_item_catalog.json") ?? [];
    const projectCraftingItemCatalogUris = await getCurrentProject()?.fileResolver?.getDataDrivenFilesFromProject("behavior_pack/item_catalog/crafting_item_catalog.json") ?? [];
    const allCraftingItemCatalogUris = [...vanillaCraftingItemCatalogUris, ...projectCraftingItemCatalogUris];

    for (const uri of allCraftingItemCatalogUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const categoriesProperty = json?.["minecraft:crafting_items_catalog"]?.categories;
            if (Array.isArray(categoriesProperty)) {
                for (const category of categoriesProperty) {
                    const groupsProperty = category?.groups;
                    if (Array.isArray(groupsProperty)) {
                        for (const group of groupsProperty) {
                            const nameProperty = group?.group_identifier?.name;
                            if (typeof nameProperty === "string") {
                                itemGroupIds.push(nameProperty);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse crafting_item_catalog from ${uri.toString()}:`, error);
        }
    }

    const projectBlockUris = await getCurrentProject()?.fileResolver?.getDataDrivenFilesFromProject("behavior_pack/blocks/<all>.json") ?? [];
    for (const uri of projectBlockUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const itemGroupProperty = json?.["minecraft:block"]?.description?.menu_category?.group;
            if (typeof itemGroupProperty === "string") {
                itemGroupIds.push(itemGroupProperty);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse block from ${uri.toString()}:`, error);
        }
    }

    const projectItemUris = await getCurrentProject()?.fileResolver?.getDataDrivenFilesFromProject("behavior_pack/items/<all>.json") ?? [];
    for (const uri of projectItemUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const itemGroupProperty = json?.["minecraft:item"]?.description?.menu_category?.group;
            if (typeof itemGroupProperty === "string") {
                itemGroupIds.push(itemGroupProperty);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(itemGroupIds));
}

export async function getItemIds(document: vscode.TextDocument, schema: MinecraftJsonSchema): Promise<string[]> {
    const vanillaItemIds = VANILLA_ITEM_IDS;

    const itemIds: string[] = [];

    const projectUris = await getCurrentProject()?.fileResolver?.getDataDrivenFilesFromProject("behavior_pack/items/<all>.json") ?? [];

    for (const uri of projectUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:item"]?.description?.identifier;
            if (typeof id === "string") {
                itemIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set([...vanillaItemIds, ...itemIds]));
}

export async function getOldFormatItemIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const itemIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/items/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver?.getDataDrivenFilesFromProject("behavior_pack/items/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:item"]?.description?.identifier;
            if (typeof id === "string") {
                const formatVersion = json?.format_version;
                if (typeof formatVersion !== "string") continue;
                if (compareVersions(formatVersion, "1.16.100") >= 0) {
                    if (itemIds.includes(id)) {
                        itemIds.splice(itemIds.indexOf(id), 1);
                    }
                    continue;
                }

                itemIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(itemIds));
}

export async function getVanillaItemGroupIdsWithoutNamespace(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const itemGroupIds = await getItemGroupIds(_document, _schema);
    const itemGroupIdsWithoutNamespace = itemGroupIds
        .filter(id => id.startsWith("minecraft:"))
        .map(id => id.replace("minecraft:", ""));
    
    return Array.from(new Set(itemGroupIdsWithoutNamespace));
}