import * as vscode from "vscode";
import { getExtensionContext } from "../context";

export async function copyTemplateFile(templateRelativePath: string, destination: vscode.Uri): Promise<void> {
    const extensionContext = getExtensionContext();
    const templateUri = vscode.Uri.joinPath(extensionContext.extensionUri, "templates", templateRelativePath);

    await vscode.workspace.fs.copy(templateUri, destination, { overwrite: true });
}