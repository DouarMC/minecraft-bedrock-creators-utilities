import * as vscode from 'vscode';

import { registerInitEnvironmentCommand } from './features/initProject/initEnvironment';
import { registerDeployFeatures } from './features/deployProject/register';
import { registerJsonSchemaFeatures } from './features/jsonSchema/register';
import { registerMolangFeatures } from './features/molang/register';
import { registerExploreMinecraftFolders } from './features/exploreMinecraftFolders/register';

export async function activate(context: vscode.ExtensionContext) {
    registerInitEnvironmentCommand(context);

    registerDeployFeatures(context);
    registerJsonSchemaFeatures(context);
    registerMolangFeatures(context);
    registerExploreMinecraftFolders(context);
}

export function deactivate() {}