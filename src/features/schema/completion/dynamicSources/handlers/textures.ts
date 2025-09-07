import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getBlockTextureReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const textureReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/textures/terrain_texture.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/textures/terrain_texture.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const textureDataProperty = json?.texture_data;
            if (typeof textureDataProperty === "object") {
                for (const key of Object.keys(textureDataProperty)) {
                    if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                        textureReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse textures from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(textureReferences));
}

export async function getDataDrivenBlockTextureReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const textureReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/textures/terrain_texture.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const textureDataProperty = json?.texture_data;
            if (typeof textureDataProperty === "object") {
                for (const key of Object.keys(textureDataProperty)) {
                    if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                        textureReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse textures from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(textureReferences));
}

export async function getDataDrivenItemTextureReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const textureReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/textures/item_texture.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const textureDataProperty = json?.texture_data;
            if (typeof textureDataProperty === "object") {
                for (const key of Object.keys(textureDataProperty)) {
                    if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                        textureReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item textures from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(textureReferences));
}

export async function getItemTextureReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const textureReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/textures/item_texture.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/textures/item_texture.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const textureDataProperty = json?.texture_data;
            if (typeof textureDataProperty === "object") {
                for (const key of Object.keys(textureDataProperty)) {
                    if (typeof textureDataProperty[key] === "object" && textureDataProperty[key].textures) {
                        textureReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse item textures from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(textureReferences));
}