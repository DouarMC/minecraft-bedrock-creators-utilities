import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenLanguageIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const languageIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/texts/languages.json") ?? [];
    
    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            if (Array.isArray(json)) {
                for (const languageEntry of json) {
                    if (typeof languageEntry === "string") {
                        languageIds.push(languageEntry);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse languages from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(languageIds));
}