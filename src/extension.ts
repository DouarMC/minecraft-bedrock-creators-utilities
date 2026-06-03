import * as vscode from "vscode";

import { VscodeUtils } from "./vscode-utils/VscodeUtils";
import { Feature } from "./features/Feature";
import { InitProjectFeature } from "./features/projectInit/InitProjectFeature";
import { MinecraftProjectManager } from "./services/projects/MinecraftProjectManager";
import { MinecraftGameManager } from "./services/minecraft/MinecraftGameManager";
import { DeployProjectFeature } from "./features/projectDeploy/DeployProjectFeature";
import { ToggleAutoDeployFeature } from "./features/projectDeploy/ToggleAutoDeployFeature";
import { ExploreMinecraftFoldersFeature } from "./features/exploreMinecraftFolders/ExploreMinecraftFoldersFeature";
import { ExportProjectFeature } from "./features/projectExport/ExportProjectFeature";
import { AddScriptApiFeature } from "./features/projectManage/AddScriptApiFeature";
import { MinecraftSchemaFeature } from "./features/schema/MinecraftSchemaFeature";
import { McStatsVisualizerFeature } from "./features/mcstats/McStatsVisualizerFeature";

export async function activate(context: vscode.ExtensionContext) {
    console.log("[MBCU] Activating Minecraft Bedrock Code Utils extension...");
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
        new MinecraftSchemaFeature(context),
        new McStatsVisualizerFeature(context)
    ];

    for (const feature of features) {
        feature.register();
    }
}

export function deactivate() {
    // TRUC A FAIRE
}