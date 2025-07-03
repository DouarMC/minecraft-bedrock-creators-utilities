import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';

function walkDirSync(dir: string, result: vscode.Uri[], extension = ".json") {
    if (!fs.existsSync(dir)) {
        return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Ignore node_modules
        if (fullPath.includes("node_modules")) {
            continue;
        }

        if (entry.isDirectory()) {
            walkDirSync(fullPath, result, extension);
        } else if (entry.isFile() && fullPath.endsWith(extension)) {
            result.push(vscode.Uri.file(fullPath));
        }
    }
}

export function findBlockFilesInWorkspace(): vscode.Uri[] {
    const result: vscode.Uri[] = [];
    const folders = vscode.workspace.workspaceFolders;

    if (!folders) {
        return result;
    }

    for (const folder of folders) {
        const rootPath = folder.uri.fsPath;
        const targetPath = path.join(rootPath, "addon", "behavior_pack", "blocks");

        walkDirSync(targetPath, result, ".json");
    }

    return result;
}

export async function findEntityFilesInWorkspace(): Promise<vscode.Uri[]> {
    const files = await vscode.workspace.findFiles(
        "**/addon/behavior_pack/entities/**/*.json",
        "**/node_modules/**"
    );
    return files;
}

export async function findItemFilesInWorkspace(): Promise<vscode.Uri[]> {
    const files = await vscode.workspace.findFiles(
        "**/addon/behavior_pack/items/**/*.json",
        "**/node_modules/**"
    );
    return files;
}

export async function findCraftingItemCatalogFileInWorkspace(): Promise<vscode.Uri | undefined> {
    const files = await vscode.workspace.findFiles(
        "**/addon/behavior_pack/item_catalog/crafting_item_catalog.json",
        "**/node_modules/**"
    );
    return files.length > 0 ? files[0] : undefined;
}

export async function findLootTableFilesInWorkspace(): Promise<vscode.Uri[]> {
    const files = await vscode.workspace.findFiles(
        "**/addon/behavior_pack/loot_tables/**/*.json",
        "**/node_modules/**"
    );
    return files;
}