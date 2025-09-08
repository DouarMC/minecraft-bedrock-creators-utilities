import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getProjectUiFilePaths(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    function getUiRelativePath(uri: vscode.Uri): string | null {
        const match = /[\/\\](ui[\/\\].+\.(json))$/i.exec(uri.fsPath);
        if (!match) {return null;}
        // Uniformise les slashs pour être cross-platform
        return match[1].replace(/\\/g, '/');
    }

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/ui/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/ui/<all>.json") ?? [];

    const vanillaUiFilePaths: string[] = [];
    for (const uri of vanillaUris) {
        const relativePath = getUiRelativePath(uri);
        if (relativePath) {
            vanillaUiFilePaths.push(relativePath);
        }
    }

    const projectUiFilePaths: string[] = [];
    for (const uri of projectUris) {
        const relativePath = getUiRelativePath(uri);
        if (relativePath) {
            if (vanillaUiFilePaths.includes(relativePath) === false) {
                projectUiFilePaths.push(relativePath);
            }
        }
    }

    return Array.from(new Set(projectUiFilePaths));
}

export async function getVanillaUiGlobalVariables(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const uiGlobalVariables: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/ui/_global_variables.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            if (typeof json === "object") {
                for (const key of Object.keys(json)) {
                    if (key.startsWith("$") === true) {
                        uiGlobalVariables.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse UI global variables from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(uiGlobalVariables));
}