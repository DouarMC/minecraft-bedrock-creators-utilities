import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenJigsawStructureIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const jigsawStructureIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/worldgen/structures/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:jigsaw"]?.description?.identifier;
            if (typeof id === "string") {
                jigsawStructureIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse jigsaw structure from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(jigsawStructureIds));
}

export async function getDataDrivenProcessorIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const processorIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/worldgen/processors/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:processor_list"]?.description?.identifier;
            if (typeof id === "string") {
                processorIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse processor from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(processorIds));
}

export async function getDataDrivenStructureSetIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const structureSetIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/worldgen/structure_sets/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:structure_set"]?.description?.identifier;
            if (typeof id === "string") {
                structureSetIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse structure_set from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(structureSetIds));
}

export async function getDataDrivenTemplatePoolIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const templatePoolIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/worldgen/template_pools/<all>.json") ?? [];
    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:template_pool"]?.description?.identifier;
            if (typeof id === "string") {
                templatePoolIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse template_pool from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(templatePoolIds));
}

export async function getProcessorIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const processorIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/worldgen/processors/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/worldgen/processors/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:processor_list"]?.description?.identifier;
            if (typeof id === "string") {
                processorIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse processor from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(processorIds));
}

export async function getTemplatePoolIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const templatePoolIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/worldgen/template_pools/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/worldgen/template_pools/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:template_pool"]?.description?.identifier;
            if (typeof id === "string") {
                templatePoolIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse template_pool from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(templatePoolIds));
}