import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../model";
import { getCurrentProject, getStableDataManager } from "../../../../../core/project/projectManager";
import { VANILLA_DIMENSION_IDS } from "../../../../../utils/data/vanillaMinecraftIdentifiers";

export async function getDataDrivenDimensionIds(_document: vscode.TextDocument, _schema: MinecraftJsonSchema): Promise<string[]> {
    const dimensionIds = VANILLA_DIMENSION_IDS;

    return Array.from(new Set(dimensionIds));
}