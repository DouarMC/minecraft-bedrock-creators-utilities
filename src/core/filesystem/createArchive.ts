import * as vscode from 'vscode';
import * as zip_lib from 'zip-lib';

export async function createArchive(sourceFolder: vscode.Uri, desintation: vscode.Uri): Promise<void> {
    const zip = new zip_lib.Zip();
    
    zip.addFolder(sourceFolder.fsPath, "");
    await zip.archive(desintation.fsPath);
}