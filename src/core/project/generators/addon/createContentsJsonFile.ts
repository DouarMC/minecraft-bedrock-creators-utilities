import * as vscode from 'vscode';

export async function createContentsJsonFile(packPath: vscode.Uri): Promise<void> {
    const contentsJsonUri = vscode.Uri.joinPath(packPath, "contents.json");
    
    try {
        await vscode.workspace.fs.stat(contentsJsonUri);
        // Le fichier existe déjà, pas besoin de le recréer
    } catch {
        // le fichier n'existe pas, on le crée
        const contentsJson = {};
        await vscode.workspace.fs.writeFile(
            contentsJsonUri,
            Buffer.from(JSON.stringify(contentsJson, null, 4), "utf8")
        );
    }
}