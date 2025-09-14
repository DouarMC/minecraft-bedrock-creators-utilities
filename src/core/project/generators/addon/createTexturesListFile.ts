import * as vscode from 'vscode';
import { getCurrentProject } from '../../projectManager';

function getTextureRelativePath(uri: vscode.Uri): string | null {
    const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
    if (!match) {return null;}
    // Uniformise les slashs pour être cross-platform
    return match[1].replace(/\\/g, '/');
}

export async function createTexturesListFile(resourcePackPath: vscode.Uri): Promise<void> {
    const textureFilePaths: string[] = [];
    const texturesUris = await getCurrentProject()?.fileResolver.getDataDrivenFilesFromProject("resource_pack/textures/*.{tga,png,jpg,jpeg}") ?? [];
    for (const uri of texturesUris) {
        const relativePath = getTextureRelativePath(uri);
        if (relativePath) {
            textureFilePaths.push(relativePath);
        }
    }

    const texturesListUri = vscode.Uri.joinPath(resourcePackPath, "textures", "textures_list.json");
    await vscode.workspace.fs.writeFile(
        texturesListUri,
        Buffer.from(JSON.stringify(textureFilePaths, null, 4), "utf8")
    );
}