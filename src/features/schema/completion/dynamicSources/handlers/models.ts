import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { compareVersions } from "../../../model/versioning/compareVersions";
import { FULL_BLOCK_MODEL_ID } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getDataDrivenModelIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const modelIds: string[] = ["minecraft:geometry.cross"];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/models/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const formatVersion = json?.format_version;
            if (typeof formatVersion !== "string") continue;
            if (compareVersions(formatVersion, "1.8.0") >= 0 && compareVersions(formatVersion, "1.12.0") < 0) {
                const keys = Object.keys(json);
                for (const key of keys) {
                    if (key.startsWith("geometry.") && typeof json[key] === "object") {
                        modelIds.push(key);
                    }
                }
            } else if (compareVersions(formatVersion, "1.12.0") >= 0) {
                const minecraftGeometry = json?.["minecraft:geometry"];
                if (Array.isArray(minecraftGeometry)) {
                    for (const geometryEntry of minecraftGeometry) {
                        const identifier = geometryEntry?.description?.identifier;
                        if (typeof identifier === "string") {
                            modelIds.push(identifier);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse model from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(modelIds));
}

export async function getFullBlockModelId(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const fullBlockModelId = FULL_BLOCK_MODEL_ID;
    return Array.from(new Set(fullBlockModelId));
}

export async function getModelIds(document: vscode.TextDocument, schema: MinecraftJsonSchema): Promise<string[]> {
    const modelIds: string[] = ["minecraft:geometry.cross"];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/models/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/models/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const formatVersion = json?.format_version;
            if (typeof formatVersion !== "string") continue;
            if (compareVersions(formatVersion, "1.8.0") >= 0 && compareVersions(formatVersion, "1.12.0") < 0) {
                const keys = Object.keys(json);
                for (const key of keys) {
                    if (key.startsWith("geometry.") && typeof json[key] === "object") {
                        modelIds.push(key);
                    }
                }
            } else if (compareVersions(formatVersion, "1.12.0") >= 0) {
                const minecraftGeometry = json?.["minecraft:geometry"];
                if (Array.isArray(minecraftGeometry)) {
                    for (const geometryEntry of minecraftGeometry) {
                        const identifier = geometryEntry?.description?.identifier;
                        if (typeof identifier === "string") {
                            modelIds.push(identifier);
                        }
                    }
                }
            }
        }
    }

    return Array.from(new Set(modelIds));
}