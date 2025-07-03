import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { findBlockFilesInWorkspace } from "./workspaceUtils";
import fs from "fs";
import path from "path";
import * as vscode from "vscode";

export function getAllBlockIdentifiers(): string[] {
    const vanillaBlockIds = Object.values(MinecraftBlockTypes);
    const uris = findBlockFilesInWorkspace();
    const customBlockIds: string[] = [];

    for (const uri of uris) {
        try {
            const content = fs.readFileSync(uri.fsPath, 'utf-8');
            const json = JSON.parse(content);

            const id = json?.["minecraft:block"]?.description?.identifier;
            if (typeof id === "string") {
                customBlockIds.push(id);
            }
        } catch (error) {
            console.warn(`⚠️ Erreur lecture fichier ${uri.fsPath}:`, error);    
        }
    }

    const all = [...vanillaBlockIds, ...customBlockIds];
    return Array.from(new Set(all)); // dédoublonnage
}

export function getAllLootTablePaths(): string[] {
    const lootTablePaths: string[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
        return [];
    }

    for (const folder of workspaceFolders) {
        const basePath = folder.uri.fsPath;
        const lootTablesDir = path.join(basePath, "addon", "behavior_pack", "loot_tables");

        if (fs.existsSync(lootTablesDir)) {
            scanLootTables(lootTablesDir, lootTablesDir, lootTablePaths);
        }
    }

    return lootTablePaths;
}

function scanLootTables(rootDir: string, currentDir: string, result: string[]) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            scanLootTables(rootDir, fullPath, result);
        } else if (entry.isFile() && fullPath.endsWith(".json")) {
            const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
            result.push(`loot_tables/${relativePath}`);
        }
    }
}