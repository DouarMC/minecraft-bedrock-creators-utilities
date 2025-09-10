import * as vscode from "vscode";

let extensionContext: vscode.ExtensionContext | undefined;

/** À appeler une fois au démarrage dans activate() */
export function setExtensionContext(ctx: vscode.ExtensionContext) {
    extensionContext = ctx;
}

/** À utiliser partout ailleurs */
export function getExtensionContext(): vscode.ExtensionContext {
    if (extensionContext === undefined) {
        throw new Error("ExtensionContext not set. Did you call setExtensionContext() in activate()?");
    }
    return extensionContext;
}
