import * as vscode from "vscode";
import { MinecraftAddonPack } from "../../../../types/projectConfig";

const PACK_TYPE_ITEMS: vscode.QuickPickItem[] = [
    {
        label: MinecraftAddonPack.BehaviorPack,
        description: "Pack de comportement.",
        detail: "Contient les comportements, entités, et scripts.",
        alwaysShow: true
    },
    {
        label: MinecraftAddonPack.ResourcePack,
        description: "Pack de ressources.",
        detail: "Contient les textures, sons, et modèles.",
        alwaysShow: true
    }
];

/**
 * Demande à l’utilisateur de sélectionner les types de packs de l’addon.
 */
export async function promptAddonPackTypes(): Promise<MinecraftAddonPack[]> {
    const packAddonItems = await vscode.window.showQuickPick(
        PACK_TYPE_ITEMS,
        {
            title: "Types de packs de l'addon",
            placeHolder: "Sélectionnez le/les types de packs pour l'addon",
            canPickMany: true,
            ignoreFocusOut: true
        }
    );

    return packAddonItems?.map(item => item.label as MinecraftAddonPack) ?? [];
}
