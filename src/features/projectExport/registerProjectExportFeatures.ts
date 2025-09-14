import * as vscode from 'vscode';
import { registerExportProjectCommand } from './commands/exportProject';

export function registerProjectExportFeatures(context: vscode.ExtensionContext) {
    registerExportProjectCommand(context);
}