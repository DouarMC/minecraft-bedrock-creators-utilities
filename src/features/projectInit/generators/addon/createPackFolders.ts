import * as vscode from "vscode";
import { MinecraftAddonPack } from "../../../../types/projectConfig";
import { createManifestObject } from "./createManifest";

export async function createPackFoldersAndManifests(
    projectFolder: vscode.Uri,
    packsAddon: MinecraftAddonPack[]
): Promise<{ behaviorManifest?: any; resourceManifest?: any }> {
    let behaviorManifest: any;
    let resourceManifest: any;

    for (const addonPackType of packsAddon) {
        const packPath = vscode.Uri.joinPath(projectFolder, "addon", addonPackType);
        await vscode.workspace.fs.createDirectory(packPath);

        const manifest = createManifestObject(addonPackType);

        if (addonPackType === MinecraftAddonPack.BehaviorPack) {
            behaviorManifest = manifest;
        } else if (addonPackType === MinecraftAddonPack.ResourcePack) {
            resourceManifest = manifest;
        }
    }

    return { behaviorManifest, resourceManifest };
}