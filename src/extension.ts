import * as vscode from 'vscode';

import { registerInitEnvironmentCommand } from './features/init/initEnvironment';
import { registerValidateProjectCommand } from './features/validation/validateProject';
import { registerDeployProjectCommand } from './features/deploy/deployProject';
import { registerWatchDeployCommand } from './features/deploy/watchProjectChanges';

import { registerSchemaVersioning } from './features/completion/schemaVersioning';


export async function testJsonDefaultsAPI() {
    console.log(vscode.languages);
}
export async function activate(context: vscode.ExtensionContext) {



    registerSchemaVersioning(context);

    registerInitEnvironmentCommand(context);
    registerValidateProjectCommand(context);
    registerDeployProjectCommand(context);
    registerWatchDeployCommand(context);
}

export function deactivate() {}