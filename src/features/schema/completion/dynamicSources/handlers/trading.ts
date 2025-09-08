import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getTradingFilePaths(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    function getTradingRelativePath(uri: vscode.Uri): string | null {
        const match = /[\/\\](trading[\/\\].+\.json)$/i.exec(uri.fsPath);
        if (!match) {return null;}
        // Uniformise les slashs pour être cross-platform
        return match[1].replace(/\\/g, '/');
    }

    const tradingFilePaths: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/trading/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/trading/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        const relativePath = getTradingRelativePath(uri);
        if (relativePath) {
            tradingFilePaths.push(relativePath);
        }
    }

    return Array.from(new Set(tradingFilePaths));
}