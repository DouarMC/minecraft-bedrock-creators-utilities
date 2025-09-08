import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getMcfunctionFilePathsWithoutExtension(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    function getMcfunctionRelativePath(uri: vscode.Uri): string | null {
        const match = /[\/\\](functions[\/\\].+)\.mcfunction$/i.exec(uri.fsPath);
        if (!match) {return null;}
        // Uniformise les slashs pour être cross-platform
        return match[1].replace(/\\/g, '/');
    }

    const mcfunctionPaths: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/functions/<all>.mcfunction") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/functions/<all>.mcfunction") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        const relativePath = getMcfunctionRelativePath(uri);
        if (relativePath) {
            mcfunctionPaths.push(relativePath);
        }
    }

    return Array.from(new Set(mcfunctionPaths));
}