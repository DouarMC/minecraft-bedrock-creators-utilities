import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getLootTableFilePaths(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    function getLootTableRelativePath(uri: vscode.Uri): string | null {
        const match = /[\/\\](loot_tables[\/\\].+\.json)$/i.exec(uri.fsPath);
        if (!match) {return null;}
        // Uniformise les slashs pour être cross-platform
        return match[1].replace(/\\/g, '/');
    }

    const lootTablePaths: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/loot_tables/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/loot_tables/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        const relativePath = getLootTableRelativePath(uri);
        if (relativePath) {
            lootTablePaths.push(relativePath);
        }
    }

    return Array.from(new Set(lootTablePaths));
}