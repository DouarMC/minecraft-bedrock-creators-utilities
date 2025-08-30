import * as vscode from "vscode";

export async function collectFiles(
    folderUri: vscode.Uri,
    recursive: boolean,
    fileNames: string[],
    fileExtensions: string[],
    excludeFileNames: string[]
): Promise<vscode.Uri[]> {
    const collectedFiles: vscode.Uri[] = [];
    try {
        const entries = await vscode.workspace.fs.readDirectory(folderUri);
        for (const [name, type] of entries) {
            if (type === vscode.FileType.File) {
                const dotIndex = name.lastIndexOf(".");
                const baseName = dotIndex > -1 ? name.substring(0, dotIndex) : name;
                const fileExtension = dotIndex > -1 ? name.substring(dotIndex) : "";

                if (
                    (fileNames.length === 0 || fileNames.includes(baseName)) &&
                    (fileExtensions.length === 0 || fileExtensions.includes(fileExtension)) &&
                    (excludeFileNames.length === 0 || !excludeFileNames.includes(baseName))
                ) {
                    collectedFiles.push(vscode.Uri.joinPath(folderUri, name));
                }
            } else if (type === vscode.FileType.Directory && recursive) {
                const subFolderUri = vscode.Uri.joinPath(folderUri, name);
                const subFiles = await collectFiles(subFolderUri, recursive, fileNames, fileExtensions, excludeFileNames);
                collectedFiles.push(...subFiles);
            }
        }
    } catch {
        console.warn(`Le dossier ${folderUri.fsPath} n'existe pas ou ne peut pas être lu.`);
    }
    return collectedFiles;
}