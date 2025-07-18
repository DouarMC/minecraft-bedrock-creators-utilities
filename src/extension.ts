import * as vscode from 'vscode';

import { registerInitEnvironmentCommand } from './features/init/initEnvironment';
import { registerValidateProjectCommand } from './features/validation/validateProject';
import { registerDeployProjectCommand } from './features/deploy/deployProject';
import { registerWatchDeployCommand } from './features/deploy/watchProjectChanges';

import { registerCompletionProvider } from './features/providers/completionProvider';
import { registerHoverProvider } from './features/providers/hoverProvider';
import { registerValidationJson } from './features/diagnostics/validationJson';

import { registerMolangEditorCommand } from './features/molang/molangEditor';
import { registerCodeActionProvider } from './features/providers/codeActionProvider';

export async function activate(context: vscode.ExtensionContext) {
    registerCompletionProvider(context);
    registerHoverProvider(context);
    registerValidationJson(context);

    registerInitEnvironmentCommand(context);
    registerValidateProjectCommand(context);
    registerDeployProjectCommand(context);
    registerWatchDeployCommand(context);
    registerMolangEditorCommand(context);

    registerCodeActionProvider(context);
}

export function deactivate() {}