// src/extension.ts
import * as vscode from "vscode";

import { initProjectManager, dispose as disposeProjectManager } from "./core/project/projectManager";

import { registerInitProjectFeatures } from "./features/projectInit/registerInitProjectFeatures";
import { registerProjectDeployFeatures } from "./features/projectDeploy/registerProjectDeployFeatures";
import { registerSchemaFeatures } from "./features/schema/registerSchemaFeatures";
import { registerExploreMinecraftFoldersFeatures } from "./features/exploreMinecraftFolders/registerExploreMinecraftFoldersFeatures";

export async function activate(context: vscode.ExtensionContext) {
    await initProjectManager(context); // Initialiser le gestionnaire de projet avant d'enregistrer les commandes

    registerInitProjectFeatures(context);
    registerProjectDeployFeatures(context);
    registerSchemaFeatures(context);
    registerExploreMinecraftFoldersFeatures(context);
}

export function deactivate() {
    disposeProjectManager();
}