import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getBiomeIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const biomeIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/biomes/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/biomes/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:biome"]?.description?.identifier;
            if (typeof id === "string") {
                biomeIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse biome from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(biomeIds));
}

export async function getBiomeTags(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const biomeTags: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/biomes/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/biomes/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const tags = json?.["minecraft:biome"]?.components?.["minecraft:tags"]?.tags;
            if (Array.isArray(tags)) {
                for (const tag of tags) {
                    if (typeof tag === "string") {
                        biomeTags.push(tag);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse biome tags from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(biomeTags));
}

export async function getDataDrivenBiomeIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const dataDrivenBiomeIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/biomes/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["minecraft:biome"]?.description?.identifier;
            if (typeof id === "string") {
                dataDrivenBiomeIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse biome from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(dataDrivenBiomeIds));
}

export async function getVanillaBiomeIdsWithoutNamespace(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const dataDrivenBiomeIds = await getDataDrivenBiomeIds(_document, _schema);
    const biomeIdsWithoutNamespace = dataDrivenBiomeIds
        .filter(id => id.startsWith("minecraft:"))
        .map(id => id.replace("minecraft:", ""));
        
    return Array.from(new Set(biomeIdsWithoutNamespace));
}