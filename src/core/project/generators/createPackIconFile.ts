import * as vscode from "vscode";
import { getExtensionContext } from "../../../core/context";

export async function createPackIconFile(packFolder: vscode.Uri): Promise<void> {
    const extensionContext = getExtensionContext();
    const iconSource = vscode.Uri.joinPath(extensionContext.extensionUri, "resources", "default_pack_icon.png");
    const iconTarget = vscode.Uri.joinPath(packFolder, "pack_icon.png");
    await vscode.workspace.fs.copy(iconSource, iconTarget);
}