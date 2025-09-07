import * as vscode from 'vscode';

export async function createVSCodeSettingsFile(folder: vscode.Uri): Promise<void> {
    const vscodeFolder = vscode.Uri.joinPath(folder, ".vscode");
    await vscode.workspace.fs.createDirectory(vscodeFolder);

    const settingsContent = {
        "files.associations": {
            "*.json": "jsonc"
        },
        "editor.tabSize": 4,
        
        "typescript.preferences.includePackageJsonAutoImports": "off",
        "typescript.preferences.autoImportFileExcludePatterns": [
            "**/node_modules/**"
        ],
        "javascript.preferences.autoImportFileExcludePatterns": ["**/node_modules/**"],

        "[typescript]": {
            "editor.snippetSuggestions": "none",
            "editor.wordBasedSuggestions": "off"
        }
    };

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(vscodeFolder, "settings.json"),
        Buffer.from(JSON.stringify(settingsContent, null, 4), "utf8")
    );
}