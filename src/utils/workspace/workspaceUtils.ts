import * as vscode from 'vscode';

export async function findBlockFilesInWorkspace(): Promise<vscode.Uri[]> {
    // Cherche tous les fichiers dans blocks/ avec extension .json dans tous les workspace folders
    return vscode.workspace.findFiles('**/addon/behavior_pack/blocks/**/*.json');
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