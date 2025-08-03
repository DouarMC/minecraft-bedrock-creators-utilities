import * as vscode from 'vscode';

// Core components
import { AjvCompiler } from './core/ajvCompiler';
import { SchemaResolver } from './core/schemaResolver';
import { JsonContextAnalyzer } from './core/jsonContextAnalyzer';
import { DynamicExamplesProvider } from './core/dynamicExamplesProvider';

// VS Code providers
import { JsonSchemaCompletionProvider } from './core/completionProvider';
import { JsonSchemaHoverProvider } from './core/hoverProvider';
import { JsonSchemaDiagnosticProvider } from './core/diagnosticProvider';

export function registerJsonSchemaFeatures(context: vscode.ExtensionContext): void {
    console.log('Initializing AJV-based JSON Schema system...');

    try {
        console.log("AAAAAAAAAAAAAAAAAAA");

        // 1. Initialize core components
        const ajvCompiler = new AjvCompiler();

        console.log("111111111111111111");

        const schemaResolver = new SchemaResolver();

        console.log("22222222222222222222");

        const jsonContextAnalyzer = new JsonContextAnalyzer();

        console.log("3333333333333333333");

        const dynamicExamplesProvider = new DynamicExamplesProvider();

        console.log("BBBBBBBBBBBBBBBBBB");

        // 2. Create diagnostic collection
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('json-schema');
        context.subscriptions.push(diagnosticCollection);

        console.log("CCCCCCCCCCCCCCCCCCCC");

        // 3. Initialize providers
        const completionProvider = new JsonSchemaCompletionProvider(
            ajvCompiler,
            schemaResolver,
            jsonContextAnalyzer,
            dynamicExamplesProvider
        );

        console.log("DDDDDDDDDDDDDDDDDDDDDDDD");

        const hoverProvider = new JsonSchemaHoverProvider(
            ajvCompiler,
            schemaResolver,
            jsonContextAnalyzer
        );

        console.log("EEEEEEEEEEEEEEEEEEEEEEEEEE");

        const diagnosticProvider = new JsonSchemaDiagnosticProvider(
            ajvCompiler,
            schemaResolver,
            diagnosticCollection
        );

        console.log("FFFFFFFFFFFFFFFFFFFFFFFFF");

        // 4. Register VS Code providers
        registerProviders(context, completionProvider, hoverProvider);

        console.log("GGGGGGGGGGGGGGGGGGGGGGGGGG");

        // 5. Setup document validation events
        setupValidationEvents(context, diagnosticProvider);

        console.log("HHHHHHHHHHHHHHHHHHHHHHHH");

        // 6. Setup cleanup
        setupCleanup(context, diagnosticProvider);

        console.log("IIIIIIIIIIIIIIIIIIIIIIIII");

        console.log('AJV-based JSON Schema system initialized successfully');

    } catch (error) {
        console.error('Failed to initialize JSON Schema system:', error);
        vscode.window.showErrorMessage('Failed to initialize JSON Schema features');
    }
}

function registerProviders(
    context: vscode.ExtensionContext,
    completionProvider: JsonSchemaCompletionProvider,
    hoverProvider: JsonSchemaHoverProvider
): void {
    // JSON file selector
    const jsonSelector: vscode.DocumentSelector = [
        { language: 'json', scheme: 'file' },
        { language: 'jsonc', scheme: 'file' }
    ];

    // Register completion provider
    const completionDisposable = vscode.languages.registerCompletionItemProvider(
        jsonSelector,
        completionProvider,
        '"', // Trigger on quote for property names
        ':', // Trigger on colon for property values
        ',', // Trigger on comma for next property
        '[', // Trigger on bracket for array items
        '{', // Trigger on brace for object properties
        ' '  // Trigger on space for general suggestions
    );

    // Register hover provider
    const hoverDisposable = vscode.languages.registerHoverProvider(
        jsonSelector,
        hoverProvider
    );

    // Add to subscriptions for cleanup
    context.subscriptions.push(completionDisposable, hoverDisposable);

    console.log('JSON Schema providers registered');
}

function setupValidationEvents(
    context: vscode.ExtensionContext,
    diagnosticProvider: JsonSchemaDiagnosticProvider
): void {
    // Validate on document open
    const onDidOpenDisposable = vscode.workspace.onDidOpenTextDocument(document => {
        if (isJsonDocument(document)) {
            diagnosticProvider.validateDocument(document);
        }
    });

    // Validate on document change
    const onDidChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        if (isJsonDocument(event.document)) {
            diagnosticProvider.validateDocument(event.document);
        }
    });

    // Validate on document save
    const onDidSaveDisposable = vscode.workspace.onDidSaveTextDocument(document => {
        if (isJsonDocument(document)) {
            diagnosticProvider.validateDocument(document);
        }
    });

    // Validate already open documents
    vscode.workspace.textDocuments.forEach(document => {
        if (isJsonDocument(document)) {
            diagnosticProvider.validateDocument(document);
        }
    });

    // Add to subscriptions
    context.subscriptions.push(
        onDidOpenDisposable,
        onDidChangeDisposable,
        onDidSaveDisposable
    );

    console.log('Document validation events configured');
}

function setupCleanup(
    context: vscode.ExtensionContext,
    diagnosticProvider: JsonSchemaDiagnosticProvider
): void {
    // Cleanup on extension deactivation
    context.subscriptions.push({
        dispose: () => {
            diagnosticProvider.dispose();
            console.log('JSON Schema system disposed');
        }
    });
}

function isJsonDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'json' || document.languageId === 'jsonc';
}

// Export for potential external use
export {
    AjvCompiler,
    SchemaResolver,
    JsonContextAnalyzer,
    DynamicExamplesProvider,
    JsonSchemaCompletionProvider,
    JsonSchemaHoverProvider,
    JsonSchemaDiagnosticProvider
};
