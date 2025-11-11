import * as vscode from "vscode";

import { registerSchemaFeatures } from "./features/schema/registerSchemaFeatures";
import { registerExploreMinecraftFoldersFeatures } from "./features/exploreMinecraftFolders/registerExploreMinecraftFoldersFeatures";
import { registerProjectExportFeatures } from "./features/projectExport/registerProjectExportFeatures";
import { registerProjectManageFeatures } from "./features/projectManage/registerProjectManageFeatures";
import { VscodeUtils } from "./core/utils/VscodeUtils";
import { Feature } from "./core/features/Feature";
import { InitProjectFeature } from "./features/projectInit/InitProjectFeature";
import { MinecraftProjectManager } from "./core/project/MinecraftProjectManager";
import { MinecraftGameManager } from "./core/minecraft/MinecraftGameManager";
import { DeployProjectFeature } from "./features/projectDeploy/DeployProjectFeature";
import { ToggleAutoDeployFeature } from "./features/projectDeploy/ToggleAutoDeployFeature";

export async function activate(context: vscode.ExtensionContext) {
    VscodeUtils.initializeContext(context);

    await MinecraftProjectManager.initialize();
    await MinecraftGameManager.initialize();

    const features: Feature[] = [
        new InitProjectFeature(context),
        new DeployProjectFeature(context),
        new ToggleAutoDeployFeature(context),
    ];

    for (const feature of features) {
        feature.register();
    }
    
    registerSchemaFeatures(context);
    registerExploreMinecraftFoldersFeatures(context);
    registerProjectExportFeatures(context);
    registerProjectManageFeatures(context);
}

export function deactivate() {
    // TRUC A FAIRE
}