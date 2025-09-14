import * as vscode from 'vscode';

export async function copyPack(packPath: vscode.Uri, targetPath: vscode.Uri): Promise<void> {
    await vscode.workspace.fs.copy(
        packPath,
        targetPath,
        {
            overwrite: true
        }
    );
}