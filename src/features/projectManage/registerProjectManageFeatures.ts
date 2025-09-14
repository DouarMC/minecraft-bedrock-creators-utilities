import * as vscode from "vscode";
import { registerAddScriptApiCommand } from "./commands/addScriptApi";

export function registerProjectManageFeatures(context: vscode.ExtensionContext) {
    registerAddScriptApiCommand(context);
}