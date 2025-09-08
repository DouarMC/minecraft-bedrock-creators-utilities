import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_ENTITY_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getDataDrivenEntityIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const entityIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/entities/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:entity"]?.description?.identifier;
            if (typeof id === "string") {
                entityIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse entity from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(entityIds));
}

export async function getEntityFamilyIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const entityFamilyIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/entities/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/entities/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const families = json?.["minecraft:entity"]?.components?.["minecraft:type_family"]?.family;
            if (Array.isArray(families)) {
                for (const family of families) {
                    if (typeof family === "string") {
                        entityFamilyIds.push(family);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse entity family from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(entityFamilyIds));
}

export async function getEntityIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const vanillaEntityIds = VANILLA_ENTITY_IDS;

    const entityIds: string[] = [];
    
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/entities/<all>.json") ?? [];

    for (const uri of projectUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:entity"]?.description?.identifier;
            if (typeof id === "string") {
                entityIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse entity from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set([...vanillaEntityIds, ...entityIds]));
}

export async function getVanillaEntityIdsWithoutNamespace(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const vanillaEntityIds = VANILLA_ENTITY_IDS;
    const entityIdsWithoutNamespace = vanillaEntityIds
        .filter(id => id.startsWith("minecraft:"))
        .map(id => id.replace("minecraft:", ""));
    
    return Array.from(new Set(entityIdsWithoutNamespace));
}