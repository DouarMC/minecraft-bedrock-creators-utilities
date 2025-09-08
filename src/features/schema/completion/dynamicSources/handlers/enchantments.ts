import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_ENCHANTMENT_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getVanillaEnchantmentIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const vanillaEnchantmentIds = VANILLA_ENCHANTMENT_IDS;

    return Array.from(new Set(vanillaEnchantmentIds));
}