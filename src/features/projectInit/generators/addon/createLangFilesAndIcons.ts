import * as vscode from "vscode";
import { MinecraftAddonPack } from "../../../../types/projectConfig";

export async function createLangFilesAndIcons(
    folder: vscode.Uri,
    packType: MinecraftAddonPack,
    displayName: string,
    version: string,
    author: string,
    context: vscode.ExtensionContext
): Promise<void> {
    const packFolder = vscode.Uri.joinPath(folder, "addon", packType);

    // 📁 Crée le dossier "texts"
    const textsFolder = vscode.Uri.joinPath(packFolder, "texts");
    await vscode.workspace.fs.createDirectory(textsFolder);

    // 🗂 languages.json
    const languagesPath = vscode.Uri.joinPath(textsFolder, "languages.json");
    await vscode.workspace.fs.writeFile(
        languagesPath,
        Buffer.from(JSON.stringify(["en_US"], null, 4), "utf8")
    );

    // 🗣 en_US.lang
    const langContent =
        `pack.name=${displayName} ${packType === MinecraftAddonPack.BehaviorPack ? "BP" : "RP"} [v${version}] - by ${author}` +
        `\npack.description=${packType === MinecraftAddonPack.BehaviorPack ? "Behavior" : "Resource"} Pack for ${displayName} - Created by ${author}`;

    const enUSPath = vscode.Uri.joinPath(textsFolder, "en_US.lang");
    await vscode.workspace.fs.writeFile(enUSPath, Buffer.from(langContent, "utf8"));

    // 🖼️ pack_icon.png
    const iconSource = vscode.Uri.joinPath(context.extensionUri, "resources", "default_pack_icon.png");
    const iconTarget = vscode.Uri.joinPath(packFolder, "pack_icon.png");
    await vscode.workspace.fs.copy(iconSource, iconTarget);
}