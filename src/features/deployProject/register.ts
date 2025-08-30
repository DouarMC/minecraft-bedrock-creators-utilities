import * as vscode from 'vscode';
import { registerDeployProjectCommand } from './commands/deployProject';
import { registerToggleWatchDeployCommand } from './commands/toggleWatchDeploy';

/**
 * Inscrit toutes les commandes liées au déploiement (manuel et auto).
 */
export function registerDeployFeatures(context: vscode.ExtensionContext) {
    registerDeployProjectCommand(context);
    registerToggleWatchDeployCommand(context);
}