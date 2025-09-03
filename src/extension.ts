// src/extension.ts
import * as vscode from "vscode";

import { initProjectManager, dispose as disposeProjectManager } from "./core/project/projectManager";

import { registerInitProjectCommand } from "./features/initProject/register";
import { registerDeployFeatures } from "./features/deployProject/register";
import { registerJsonSchemaFeatures } from "./features/jsonSchema/register";
import { registerExploreMinecraftFolders } from "./features/exploreMinecraftFolders/register";

export async function activate(context: vscode.ExtensionContext) {
    await initProjectManager(context); // Initialiser le gestionnaire de projet avant d'enregistrer les commandes

    registerInitProjectCommand(context);
    registerDeployFeatures(context);
    registerJsonSchemaFeatures(context);
    registerExploreMinecraftFolders(context);
}

export function deactivate() {
    disposeProjectManager();
}