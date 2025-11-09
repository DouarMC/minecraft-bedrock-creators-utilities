import * as vscode from "vscode";

/**
 * Classe abstraite représentant une fonctionnalité de l'extension.
 */
export abstract class Feature {
    /**
     * Contexte de l'extension VSCode.
     */
    protected readonly extensionContext: vscode.ExtensionContext;

    public constructor(extensionContext: vscode.ExtensionContext) {
        this.extensionContext = extensionContext;
    }

    /**
     * Fonction pour enregistrer les fonctionnalités spécifiques.
     */
    public abstract register(): void;
}