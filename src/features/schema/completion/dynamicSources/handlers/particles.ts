import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";

export async function getDataDrivenParticleEffectIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const particleEffectIds: string[] = [];

    const vanillaUris = await getStableDataManager()?.getFiles("resource_pack/particles/<all>.json") ?? [];

    for (const uri of vanillaUris) {
        try {
            const fileData = await vscode.workspace.fs.readFile(uri);
            const content = new TextDecoder("utf-8").decode(fileData);
            const json = JsonParser.parse(content);

            const id = json?.["particle_effect"]?.description?.identifier;
            if (typeof id === "string") {
                particleEffectIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to read or parse particle effect from ${uri.toString()}:`, error);
        }
    }

    return Array.from(new Set(particleEffectIds));
}