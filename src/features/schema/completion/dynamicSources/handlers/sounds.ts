import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getBlockSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const baseBlockSoundReferences: string[] = [];
    const interactiveBlockSoundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/sounds.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const blockSoundsProperty = json?.["block_sounds"];
            if (typeof blockSoundsProperty === "object") {
                for (const key of Object.keys(blockSoundsProperty)) {
                    if (typeof blockSoundsProperty[key] === "object") {
                        baseBlockSoundReferences.push(key);
                    }
                }
            }

            const interactiveBlockSoundsProperty = json?.["interactive_sounds"]?.block_sounds;
            if (typeof interactiveBlockSoundsProperty === "object") {
                for (const key of Object.keys(interactiveBlockSoundsProperty)) {
                    if (typeof interactiveBlockSoundsProperty[key] === "object") {
                        interactiveBlockSoundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set([...baseBlockSoundReferences, ...interactiveBlockSoundReferences]));
}

export async function getDataDrivenBaseBlockSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const baseBlockSoundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const blockSoundsProperty = json?.["block_sounds"];
            if (typeof blockSoundsProperty === "object") {
                for (const key of Object.keys(blockSoundsProperty)) {
                    if (typeof blockSoundsProperty[key] === "object") {
                        baseBlockSoundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(baseBlockSoundReferences));
}

export async function getDataDrivenIndividualEventSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const individualEventSoundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const individualEventSoundsProperty = json?.individual_event_sounds?.events;
            if (typeof individualEventSoundsProperty === "object") {
                for (const key of Object.keys(individualEventSoundsProperty)) {
                    if (typeof individualEventSoundsProperty[key] === "object") {
                        individualEventSoundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(individualEventSoundReferences));
}

export async function getDataDrivenIndividualNamedSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const individualNamedSoundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const individualNamedSoundsProperty = json?.individual_named_sounds?.sounds;
            if (typeof individualNamedSoundsProperty === "object") {
                for (const key of Object.keys(individualNamedSoundsProperty)) {
                    if (typeof individualNamedSoundsProperty[key] === "object") {
                        individualNamedSoundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(individualNamedSoundReferences));
}

export async function getDataDrivenInteractiveBlockSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const interactiveBlockSoundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const interactiveBlockSoundsProperty = json?.["interactive_sounds"]?.block_sounds;
            if (typeof interactiveBlockSoundsProperty === "object") {
                for (const key of Object.keys(interactiveBlockSoundsProperty)) {
                    if (typeof interactiveBlockSoundsProperty[key] === "object") {
                        interactiveBlockSoundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(interactiveBlockSoundReferences));
}

export async function getDataDrivenSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const soundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds/sound_definitions.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const soundDefinitionsProperty = json?.sound_definitions;
            if (typeof soundDefinitionsProperty === "object") {
                const soundDefinitionKeys = Object.keys(soundDefinitionsProperty);
                for (const key of soundDefinitionKeys) {
                    if (typeof soundDefinitionsProperty[key] === "object") {
                        soundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(soundReferences));
}

export async function getSoundFilePathsWithoutExtension(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
     function getSoundRelativePath(uri: vscode.Uri): string | null {
        // Ajout de fsb et extension supprimée dans le résultat
        const match = /[\/\\](sounds[\/\\].+?)(?:\.(ogg|wav|mp3|fsb))?$/i.exec(uri.fsPath);
        if (!match) { return null; }
        // Uniformise les slashs pour être cross-platform
        return match[1].replace(/\\/g, '/');
    }
    
    const soundFilePaths: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds/*.{wav,mp3,ogg,fsb}") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/sounds/*.{wav,mp3,ogg,fsb}") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        const relativePath = getSoundRelativePath(uri);
        if (relativePath) {
            soundFilePaths.push(relativePath);
        }
    }

    return Array.from(new Set(soundFilePaths));
}

export async function getSoundReferences(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const soundReferences: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/sounds/sound_definitions.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/sounds/sound_definitions.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const soundDefinitionsProperty = json?.sound_definitions;
            if (typeof soundDefinitionsProperty === "object") {
                const soundDefinitionKeys = Object.keys(soundDefinitionsProperty);
                for (const key of soundDefinitionKeys) {
                    if (typeof soundDefinitionsProperty[key] === "object") {
                        soundReferences.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse sounds from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(soundReferences));
}