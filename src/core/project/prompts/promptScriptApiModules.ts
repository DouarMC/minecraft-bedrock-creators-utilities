import * as vscode from "vscode";
import { MinecraftProduct } from "../../../types/projectConfig";
import {
    SCRIPT_API_MODULES,
    SCRIPT_API_MODULES_PREVIEW,
    SCRIPT_API_MODULES_NAMES,
    SCRIPT_API_MODULES_NAMES_PREVIEW
} from "../../../utils/data/scriptApiModules";

/**
 * Demande à l'utilisateur s'il veut inclure l'API Script et, si oui,
 * quels modules et versions.
 * 
 * Retourne un dictionnaire { moduleName: version } ou undefined si annulé/refusé.
 */
export async function promptScriptApiModules(minecraftProduct: MinecraftProduct): Promise<Record<string, string> | undefined> {
    const moduleNames = minecraftProduct === MinecraftProduct.Stable
        ? SCRIPT_API_MODULES_NAMES
        : SCRIPT_API_MODULES_NAMES_PREVIEW;

    const moduleVersions = minecraftProduct === MinecraftProduct.Stable
        ? SCRIPT_API_MODULES
        : SCRIPT_API_MODULES_PREVIEW;

    const selectedModules = await vscode.window.showQuickPick(moduleNames, {
        title: "Modules de l'API Script",
        placeHolder: "Sélectionnez les modules à inclure",
        canPickMany: true
    });

    if (!selectedModules || selectedModules.length === 0) return;

    const selectedWithVersions: Record<string, string> = {};

    for (const module of selectedModules) {
        const versions = moduleVersions[module];
        const version = await vscode.window.showQuickPick(versions, {
            title: `Version du module ${module}`,
            placeHolder: `Sélectionnez la version du module ${module}`
        });

        if (version) {
            selectedWithVersions[module] = version;
        }
    }

    return selectedWithVersions;
}