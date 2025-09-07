import * as vscode from 'vscode';
import { registerDeployProjectCommand } from './commands/deployProjectCommand';
import { registerToggleWatchDeployCommand } from './commands/toggleWatchDeployCommand';

/**
 * Inscrit toutes les commandes liées au déploiement (manuel et auto).
 */
export function registerProjectDeployFeatures(context: vscode.ExtensionContext) {
    registerDeployProjectCommand(context);
    registerToggleWatchDeployCommand(context);
}