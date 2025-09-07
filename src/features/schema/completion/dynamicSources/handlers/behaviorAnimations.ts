import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getBehaviorAnimationIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const behaviorAnimationIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("behavior_pack/animations/<all>.json") ?? [];
    const projectUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("behavior_pack/animations/<all>.json") ?? [];
    const allUris = [...vanillaUris, ...projectUris];

    for (const uri of allUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const animations = json?.animations;
            if (typeof animations === "object") {
                for (const key of Object.keys(animations)) {
                    if (typeof animations[key] === "object") {
                        behaviorAnimationIds.push(key);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse behavior animation from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(behaviorAnimationIds));
}