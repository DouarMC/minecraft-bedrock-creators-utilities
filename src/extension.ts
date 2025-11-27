import * as vscode from "vscode";

import { registerSchemaFeatures } from "./features/schema/registerSchemaFeatures";
import { VscodeUtils } from "./core/utils/VscodeUtils";
import { Feature } from "./core/features/Feature";
import { InitProjectFeature } from "./features/projectInit/InitProjectFeature";
import { MinecraftProjectManager } from "./core/project/MinecraftProjectManager";
import { MinecraftGameManager } from "./core/minecraft/games/MinecraftGameManager";
import { DeployProjectFeature } from "./features/projectDeploy/DeployProjectFeature";
import { ToggleAutoDeployFeature } from "./features/projectDeploy/ToggleAutoDeployFeature";
import { ExploreMinecraftFoldersFeature } from "./features/exploreMinecraftFolders/ExploreMinecraftFoldersFeature";
import { ExportProjectFeature } from "./features/projectExport/ExportProjectFeature";
import { AddScriptApiFeature } from "./features/projectManage/AddScriptApiFeature";

export async function activate(context: vscode.ExtensionContext) {
    VscodeUtils.initializeContext(context);

    await MinecraftProjectManager.initialize();
    await MinecraftGameManager.initialize();

    const features: Feature[] = [
        new InitProjectFeature(context),
        new DeployProjectFeature(context),
        new ToggleAutoDeployFeature(context),
        new ExploreMinecraftFoldersFeature(context),
        new ExportProjectFeature(context),
        new AddScriptApiFeature(context),
    ];

    for (const feature of features) {
        feature.register();
    }
    
    registerSchemaFeatures(context);
}

export function deactivate() {
    // TRUC A FAIRE
}