import * as vscode from 'vscode';

import { registerInitEnvironmentCommand } from './features/initProject/initEnvironment';
import { registerDeployFeatures } from './features/deployProject/register';
import { registerJsonSchemaFeatures } from './features/jsonSchema/register';
import { registerMolangFeatures } from './features/molang/register';
import { registerExploreMinecraftFolders } from './features/exploreMinecraftFolders/register';
import { ExtensionCacheManager } from './cache/extensionCacheManager';
import { PerformanceMonitor } from './utils/performanceMonitor';

let cacheManager: ExtensionCacheManager;

export async function activate(context: vscode.ExtensionContext) {
    // Initialisation du gestionnaire de cache en premier
    cacheManager = new ExtensionCacheManager(context);

    // Initialisation du monitoring de performance
    PerformanceMonitor.registerCommands(context);

    // Enregistrement des fonctionnalités
    registerInitEnvironmentCommand(context);
    registerDeployFeatures(context);
    registerJsonSchemaFeatures(context);
    registerMolangFeatures(context);
    registerExploreMinecraftFolders(context);
}

export function deactivate() {
    // Le nettoyage des caches est géré automatiquement par le CacheManager
    PerformanceMonitor.disable();
}