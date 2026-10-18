import * as vscode from "vscode";
import { Feature } from "../Feature";
import { MinecraftSchemaService } from "../../core/minecraft/schemas/MinecraftSchemaService";
import { SchemaHover } from "../../core/jsonSchema/SchemaHover";
import { SchemaCompletion } from "../../core/jsonSchema/SchemaCompletion";
import { SchemaDiagnostics } from "../../core/jsonSchema/SchemaDiagnostics";

export class MinecraftSchemaFeature extends Feature {
    private static readonly DOCUMENT_SELECTOR: vscode.DocumentSelector = [
        {language: "json", scheme: "file"},
        {language: "jsonc", scheme: "file"}
    ];

    public register(): void {
        this.registerHoverProvider();
        this.registerCompletionProvider();

        this.extensionContext.subscriptions.push(
            this.registerDiagnosticsProvider()
        );
    }

    /**
     * Enregistre le fournisseur de survol (hover provider) pour les fichiers JSON et JSONC.
     */
    private registerHoverProvider(): void {
        this.extensionContext.subscriptions.push(
            vscode.languages.registerHoverProvider(
                MinecraftSchemaFeature.DOCUMENT_SELECTOR,
                {
                    async provideHover(document, position) {
                        console.log("Providing hover...");
                        const schema = await MinecraftSchemaService.getSchemaForDocument(document);
                        if (! schema) {
                            return null;
                        }

                        return SchemaHover.doHover(document, position, schema);
                    }
                }
            )
        );
    }

    /**
     * Enregistre le fournisseur de complétion (completion provider) pour les fichiers JSON et JSONC.
     */
    private registerCompletionProvider(): void {
        this.extensionContext.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                MinecraftSchemaFeature.DOCUMENT_SELECTOR,
                {
                    async provideCompletionItems(document, position) {
                        const schema = await MinecraftSchemaService.getSchemaForDocument(document);
                        if (! schema) {
                            return null;
                        }

                        const completionList = await SchemaCompletion.doCompletion(document, position, schema);
                        return completionList;
                    }
                }
            )
        );
    }

    /**
     * Enregistre le fournisseur de diagnostics pour les fichiers JSON et JSONC.
     * @returns 
     */
    private registerDiagnosticsProvider(): vscode.DiagnosticCollection {
        const diagnostics = vscode.languages.createDiagnosticCollection("minecraft-bedrock-creators-utilities.jsonSchema");

        this.extensionContext.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(async event => {
                if (vscode.languages.match(MinecraftSchemaFeature.DOCUMENT_SELECTOR, event.document)) {
                    await this.updateDiagnostics(event.document, diagnostics);
                }
            }),

            vscode.workspace.onDidOpenTextDocument(async document => {
                if (vscode.languages.match(MinecraftSchemaFeature.DOCUMENT_SELECTOR, document)) {
                    await this.updateDiagnostics(document, diagnostics);
                }
            }),

            vscode.workspace.onDidCloseTextDocument(document => {
                diagnostics.delete(document.uri);
            })
        );

        return diagnostics;
    }

    /**
     * Met à jour les diagnostics pour un document donné en fonction de son schéma JSON.
     * @param document Le document à analyser.
     * @param diagnostics La collection de diagnostics à mettre à jour.
     * @returns 
     */
    private async updateDiagnostics(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection): Promise<void> {
        const schema = await MinecraftSchemaService.getSchemaForDocument(document);
        if (schema === undefined) {
            diagnostics.set(document.uri, []);
            return;
        }

        const diags = SchemaDiagnostics.doValidation(document, schema);
        diagnostics.set(document.uri, diags ?? []);
    }
}