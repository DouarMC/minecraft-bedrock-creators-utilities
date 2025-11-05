import * as vscode from "vscode";
import { registerInitProjectCommand } from "./commands/initProjectCommand";

export function registerInitProjectFeatures() {
    registerInitProjectCommand();
}