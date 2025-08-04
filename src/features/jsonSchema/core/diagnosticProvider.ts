import * as vscode from 'vscode';
import * as jsonc from 'jsonc-parser';
import { AjvCompiler } from './ajvCompiler';
import { SchemaResolver } from './schemaResolver';

export class JsonSchemaDiagnosticProvider {
    private ajvCompiler: AjvCompiler;
    private schemaResolver: SchemaResolver;
    private diagnosticCollection: vscode.DiagnosticCollection;
    private validateTimeouts = new Map<string, NodeJS.Timeout>();
    private compiledSchemas = new Map<string, string>(); // Cache des schemas compilés

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
        console.log(`🔍 DiagnosticProvider: Validation triggered for: ${document.uri.fsPath}`);
        
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
                console.log(`🔍 DiagnosticProvider: No schema found for ${document.uri.fsPath}`);
                return; // No schema = no validation
            }
            
            // 3. Compile schema if not already compiled (avec cache)
            const schemaId = document.uri.fsPath;
            const schemaHash = JSON.stringify(schema);
            
            if (this.compiledSchemas.get(schemaId) !== schemaHash) {
                console.log(`⚙️ DiagnosticProvider: Compiling schema for ${schemaId}`);
                this.ajvCompiler.compileSchema(schema, schemaId);
                this.compiledSchemas.set(schemaId, schemaHash);
            }
            
            // 4. Validate
            const validationResult = this.ajvCompiler.validate(jsonData, schemaId);
            
            // 5. Convert AJV errors to VS Code diagnostics
            if (!validationResult.valid && validationResult.errors) {
                console.log(`🔍 DiagnosticProvider: Found ${validationResult.errors.length} validation errors`);
                const diagnostics = this.convertAjvErrorsToDiagnostics(
                    validationResult.errors,
                    document
                );
                this.diagnosticCollection.set(document.uri, diagnostics);
            } else {
                console.log(`✅ DiagnosticProvider: No validation errors found`);
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
        
        // Filter out non-significant errors within oneOf
        const filteredErrors = this.filterOneOfErrors(errors);
        
        for (const error of filteredErrors) {
            const diagnostic = this.createDiagnosticFromAjvError(error, document);
            if (diagnostic) {
                diagnostics.push(diagnostic);
            }
        }
        
        return diagnostics;
    }

    /**
     * Filter out non-significant errors within oneOf alternatives
     */
    private filterOneOfErrors(errors: any[]): any[] {
        const filtered: any[] = [];
        const oneOfErrors = new Map<string, any[]>();
        
        // Group errors by instance path
        for (const error of errors) {
            const path = error.instancePath || '';
            
            if (error.keyword === 'oneOf') {
                // Keep oneOf errors as they are now clustered in AJV
                filtered.push(error);
            } else {
                // Check if this error is part of a oneOf validation
                const isPartOfOneOf = errors.some(e => 
                    e.keyword === 'oneOf' && 
                    e.instancePath === path && 
                    e.schemaPath.includes(error.schemaPath.split('/').slice(-2, -1)[0])
                );
                
                if (!isPartOfOneOf) {
                    // This is a significant error, not just a oneOf branch failing
                    filtered.push(error);
                }
            }
        }
        
        return filtered;
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
            
            // Use jsonc-parser to map AJV instancePath to editor ranges
            if (error.instancePath) {
                const position = this.mapInstancePathToRange(error.instancePath, text, document);
                if (position) {
                    return position;
                }
            }
            
            // Fallback to property name if available
            if (error.params && error.params.missingProperty) {
                const position = this.findPropertyPosition(error.params.missingProperty, text, document);
                if (position) {
                    return position;
                }
            }
            
            // Additional fallback for different error types
            if (error.schemaPath) {
                // Try to find property based on schema path
                const schemaSegments = error.schemaPath.split('/');
                for (const segment of schemaSegments) {
                    if (segment && segment !== '#' && segment !== 'properties') {
                        const position = this.findPropertyPosition(segment, text, document);
                        if (position) {
                            return position;
                        }
                    }
                }
            }
            
            // Default to start of document
            return new vscode.Range(0, 0, 0, 1);
            
        } catch (err) {
            console.warn('Error finding error position:', err);
            return new vscode.Range(0, 0, 0, 1);
        }
    }

    /**
     * Map AJV instancePath to editor ranges using jsonc-parser
     */
    private mapInstancePathToRange(instancePath: string, text: string, document: vscode.TextDocument): vscode.Range | null {
        try {
            // Parse the JSON to get node information
            const parseErrors: jsonc.ParseError[] = [];
            const jsonNode = jsonc.parseTree(text, parseErrors);
            
            if (!jsonNode || parseErrors.length > 0) {
                return null;
            }
            
            // Convert instancePath to JSON pointer path
            const path = instancePath.replace(/^\//, '').split('/').filter(segment => segment !== '');
            
            // Navigate to the target node
            let currentNode = jsonNode;
            for (const segment of path) {
                if (!currentNode || !currentNode.children) {
                    return null;
                }
                
                if (currentNode.type === 'object') {
                    // Find property in object
                    const propertyNode = currentNode.children.find(child => 
                        child.type === 'property' && 
                        child.children && 
                        child.children[0] && 
                        child.children[0].value === segment
                    );
                    
                    if (propertyNode && propertyNode.children && propertyNode.children[1]) {
                        currentNode = propertyNode.children[1]; // Value node
                    } else {
                        return null;
                    }
                } else if (currentNode.type === 'array') {
                    // Find array element
                    const index = parseInt(segment, 10);
                    if (isNaN(index) || index >= currentNode.children.length) {
                        return null;
                    }
                    currentNode = currentNode.children[index];
                } else {
                    return null;
                }
            }
            
            // Convert node offset to position
            if (currentNode.offset !== undefined && currentNode.length !== undefined) {
                const startPos = document.positionAt(currentNode.offset);
                const endPos = document.positionAt(currentNode.offset + currentNode.length);
                return new vscode.Range(startPos, endPos);
            }
            
            return null;
        } catch (err) {
            console.warn('Error mapping instance path to range:', err);
            return null;
        }
    }

    private findPositionByPath(
        path: string[],
        text: string,
        document: vscode.TextDocument
    ): vscode.Range | null {
        try {
            // Parser JSON pour avoir une structure précise
            const jsonObj = JSON.parse(text);
            let current = jsonObj;
            let searchText = '';
            
            // Naviguer dans l'objet JSON
            for (let i = 0; i < path.length; i++) {
                const segment = path[i];
                if (!segment) continue;
                
                if (current && typeof current === 'object' && segment in current) {
                    current = current[segment];
                    searchText = `"${segment}"`;
                    
                    // Chercher cette propriété dans le texte
                    const index = text.indexOf(searchText);
                    if (index !== -1) {
                        const position = document.positionAt(index);
                        return new vscode.Range(position, position.translate(0, searchText.length));
                    }
                } else {
                    break;
                }
            }
            
            return null;
        } catch {
            // Fallback vers l'ancienne méthode
            let searchPattern = '';
            for (const segment of path) {
                if (segment) {
                    searchPattern = `"${segment}"`;
                    const index = text.indexOf(searchPattern);
                    if (index !== -1) {
                        const position = document.positionAt(index);
                        return new vscode.Range(position, position.translate(0, segment.length + 2));
                    }
                }
            }
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