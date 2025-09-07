import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_EFFECT_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getEffectIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const effectIds: string[] = VANILLA_EFFECT_IDS;
    return Array.from(new Set(effectIds));
}