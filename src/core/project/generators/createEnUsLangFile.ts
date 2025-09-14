import * as vscode from "vscode";
import { MinecraftAddonPack, ProjectMetadata } from "../../../types/projectConfig";

export async function createEnUsLangFile(packFolder: vscode.Uri, projectMetadata: ProjectMetadata, packType: MinecraftAddonPack): Promise<void> {
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
    const displayName = projectMetadata.displayName;
    const author = projectMetadata.author;
    const packLabel = packType === MinecraftAddonPack.BehaviorPack ? "BP" : "RP";
    const langContent =
        `pack.name=${displayName} ${packLabel} [v0.0.1] - by ${author}` +
        `\npack.description=Pack for ${displayName} - Created by ${author}`;
    const enUSPath = vscode.Uri.joinPath(textsFolder, "en_US.lang");
    await vscode.workspace.fs.writeFile(enUSPath, Buffer.from(langContent, "utf8"));
}