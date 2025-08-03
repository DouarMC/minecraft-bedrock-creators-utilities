import * as vscode from 'vscode';
import { AjvCompiler } from './ajvCompiler';
import { SchemaResolver } from './schemaResolver';

export class JsonSchemaDiagnosticProvider {
    private ajvCompiler: AjvCompiler;
    private schemaResolver: SchemaResolver;
    private diagnosticCollection: vscode.DiagnosticCollection;
    private validateTimeouts = new Map<string, NodeJS.Timeout>();

    constructor(
        ajvCompiler: AjvCompiler,
        schemaResolver: SchemaResolver,
        diagnosticCollection: vscode.DiagnosticCollection
    ) {
        this.ajvCompiler = ajvCompiler;
        this.schemaResolver = schemaResolver;
        this.diagnosticCollection = diagnosticCollection;
    }

    public validateDocument(document: vscode.TextDocument): void {
        // Clear previous timeout
        const timeout = this.validateTimeouts.get(document.uri.toString());
        if (timeout) {
            clearTimeout(timeout);
        }

        // Debounced validation (500ms)
        this.validateTimeouts.set(document.uri.toString(), setTimeout(() => {
            this.performValidation(document);
        }, 500));
    }

    private performValidation(document: vscode.TextDocument): void {
        try {
            // Clear previous diagnostics
            this.diagnosticCollection.delete(document.uri);
            
            // 1. Parse JSON content
            let jsonData: any;
            try {
                jsonData = JSON.parse(document.getText());
            } catch (parseError) {
                // Handle JSON syntax errors
                this.handleJsonSyntaxError(document, parseError as Error);
                return;
            }
            
            // 2. Resolve schema for this file
            const schema = this.schemaResolver.resolveSchemaForFile(
                document.uri.fsPath,
                document.getText()
            );
            
            if (!schema) {
                return; // No schema = no validation
            }
            
            // 3. Compile and validate with AJV
            const schemaId = document.uri.fsPath;
            this.ajvCompiler.compileSchema(schema, schemaId);
            
            const validationResult = this.ajvCompiler.validate(schemaId, jsonData);
            
            // 4. Convert AJV errors to VS Code diagnostics
            if (!validationResult.valid && validationResult.errors) {
                const diagnostics = this.convertAjvErrorsToDiagnostics(
                    validationResult.errors,
                    document
                );
                this.diagnosticCollection.set(document.uri, diagnostics);
            }
            
        } catch (error) {
            console.error('Erreur dans DiagnosticProvider:', error);
        }
    }

    private handleJsonSyntaxError(document: vscode.TextDocument, error: Error): void {
        // Create diagnostic for JSON syntax error
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 0),
            `JSON Syntax Error: ${error.message}`,
            vscode.DiagnosticSeverity.Error
        );
        
        diagnostic.source = 'json-schema';
        this.diagnosticCollection.set(document.uri, [diagnostic]);
    }

    private convertAjvErrorsToDiagnostics(
        errors: any[],
        document: vscode.TextDocument
    ): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        
        for (const error of errors) {
            const diagnostic = this.createDiagnosticFromAjvError(error, document);
            if (diagnostic) {
                diagnostics.push(diagnostic);
            }
        }
        
        return diagnostics;
    }

    private createDiagnosticFromAjvError(
        error: any,
        document: vscode.TextDocument
    ): vscode.Diagnostic | null {
        try {
            // Find position of the error in the document
            const position = this.findErrorPosition(error, document);
            if (!position) {
                return null;
            }
            
            // Create diagnostic message
            const message = this.createErrorMessage(error);
            
            // Create diagnostic
            const diagnostic = new vscode.Diagnostic(
                position,
                message,
                this.getErrorSeverity(error)
            );
            
            diagnostic.source = 'json-schema';
            diagnostic.code = error.keyword;
            
            return diagnostic;
            
        } catch (err) {
            console.warn('Erreur lors de la création du diagnostic:', err);
            return null;
        }
    }

    private findErrorPosition(error: any, document: vscode.TextDocument): vscode.Range | null {
        try {
            const text = document.getText();
            
            // Convert JSON path to position
            if (error.instancePath) {
                const path = error.instancePath.replace(/^\//, '').split('/');
                return this.findPositionByPath(path, text, document);
            }
            
            // Fallback to property name if available
            if (error.params && error.params.missingProperty) {
                return this.findPropertyPosition(error.params.missingProperty, text, document);
            }
            
            // Default to start of document
            return new vscode.Range(0, 0, 0, 1);
            
        } catch (err) {
            return new vscode.Range(0, 0, 0, 1);
        }
    }

    private findPositionByPath(
        path: string[],
        text: string,
        document: vscode.TextDocument
    ): vscode.Range | null {
        try {
            // Simple implementation - find property by name
            // For a more robust solution, you'd use a proper JSON parser with position tracking
            let currentPath = '';
            for (const segment of path) {
                if (segment) {
                    currentPath += `"${segment}"`;
                    const index = text.indexOf(currentPath);
                    if (index !== -1) {
                        const position = document.positionAt(index);
                        return new vscode.Range(position, position.translate(0, segment.length + 2));
                    }
                }
            }
            return null;
        } catch {
            return null;
        }
    }

    private findPropertyPosition(
        propertyName: string,
        text: string,
        document: vscode.TextDocument
    ): vscode.Range | null {
        const searchPattern = `"${propertyName}"`;
        const index = text.indexOf(searchPattern);
        
        if (index !== -1) {
            const position = document.positionAt(index);
            return new vscode.Range(position, position.translate(0, searchPattern.length));
        }
        
        return new vscode.Range(0, 0, 0, 1);
    }

    private createErrorMessage(error: any): string {
        let message = '';
        
        switch (error.keyword) {
            case 'required':
                message = `Missing required property: ${error.params.missingProperty}`;
                break;
            case 'enum':
                message = `Value must be one of: ${error.params.allowedValues?.join(', ') || 'allowed values'}`;
                break;
            case 'type':
                message = `Expected type: ${error.params.type}`;
                break;
            case 'pattern':
                message = `Value does not match pattern: ${error.params.pattern}`;
                break;
            case 'minLength':
                message = `String too short (minimum: ${error.params.limit})`;
                break;
            case 'maxLength':
                message = `String too long (maximum: ${error.params.limit})`;
                break;
            case 'minimum':
                message = `Value too small (minimum: ${error.params.limit})`;
                break;
            case 'maximum':
                message = `Value too large (maximum: ${error.params.limit})`;
                break;
            case 'molang':
                message = `Invalid Molang expression: ${error.message}`;
                break;
            default:
                message = error.message || 'Schema validation error';
        }
        
        return message;
    }

    private getErrorSeverity(error: any): vscode.DiagnosticSeverity {
        // Most schema errors are errors, but some could be warnings
        switch (error.keyword) {
            case 'pattern':
            case 'format':
                return vscode.DiagnosticSeverity.Warning;
            default:
                return vscode.DiagnosticSeverity.Error;
        }
    }

    public dispose(): void {
        // Clear all timeouts
        for (const timeout of this.validateTimeouts.values()) {
            clearTimeout(timeout);
        }
        this.validateTimeouts.clear();
    }
}