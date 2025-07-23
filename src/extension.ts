import * as vscode from 'vscode';

import { registerInitEnvironmentCommand } from './features/initProject/initEnvironment';



import { registerCompletionProvider } from './features/jsonSchema/completionProvider';
import { registerHoverProvider } from './features/jsonSchema/hoverProvider';
import { registerValidationJson } from './features/jsonSchema/validationJson';

import { registerMolangEditorCommand } from './features/molang/molangEditor';
import { registerCodeActionProvider } from './features/molang/codeActionProvider';
import { registerInMemoryFileSystemProvider } from './features/molang/InMemoryFileSystemProvider';
import { registerMolangLanguage } from './features/molang/molangLanguage';
import { registerDeployFeatures } from './features/deployProject/register';

export async function activate(context: vscode.ExtensionContext) {
    registerInitEnvironmentCommand(context);

    registerDeployFeatures(context);

    registerCompletionProvider(context);
    registerHoverProvider(context);
    registerValidationJson(context);

    registerMolangLanguage(context);
    registerInMemoryFileSystemProvider(context);
    registerMolangEditorCommand(context);
    registerCodeActionProvider(context);
}

export function deactivate() {}