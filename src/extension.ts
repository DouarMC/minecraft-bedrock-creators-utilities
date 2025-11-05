// src/extension.ts
import * as vscode from "vscode";

import { registerInitProjectFeatures } from "./features/projectInit/registerInitProjectFeatures";
import { registerProjectDeployFeatures } from "./features/projectDeploy/registerProjectDeployFeatures";
import { registerSchemaFeatures } from "./features/schema/registerSchemaFeatures";
import { registerExploreMinecraftFoldersFeatures } from "./features/exploreMinecraftFolders/registerExploreMinecraftFoldersFeatures";
import { registerProjectExportFeatures } from "./features/projectExport/registerProjectExportFeatures";
import { registerProjectManageFeatures } from "./features/projectManage/registerProjectManageFeatures";
import { VscodeUtils } from "./core/utils/VscodeUtils";

export async function activate(context: vscode.ExtensionContext) {
    VscodeUtils.initializeContext(context);

    registerInitProjectFeatures();
    registerProjectDeployFeatures(context);
    registerSchemaFeatures(context);
    registerExploreMinecraftFoldersFeatures(context);
    registerProjectExportFeatures(context);
    registerProjectManageFeatures(context);
}

export function deactivate() {
    // TRUC A FAIRE
}