import * as vscode from 'vscode';
import { MinecraftJsonSchema } from '../../../common/types/MinecraftJsonSchema';
import * as JsonParser from 'jsonc-parser';
import { ValidationContext } from './ValidationContext';
import { NoOpSchemaCollector } from './collectors/NoOpSchemaCollector';
import { ValidationResult } from './ValidationResult';
import { SchemaUtils } from './SchemaUtils';

export class SchemaDiagnostics {
    public static doValidation(document: vscode.TextDocument, schema: MinecraftJsonSchema, severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Warning): vscode.Diagnostic[] | undefined {
        const root = JsonParser.parseTree(document.getText());
        if (root === undefined) {
            return [];
        }

        const validationContext: ValidationContext = {
            document: document,
            rootSchema: schema,
            collector: NoOpSchemaCollector.instance
        };

        const validationResult = new ValidationResult();
        SchemaUtils.validate(root, schema, validationResult, validationContext);

        return this.toDiagnostics(validationResult, severity);
    }

    public static toDiagnostics(result: ValidationResult, severity: vscode.DiagnosticSeverity): vscode.Diagnostic[] {
        return result.problems.map(problem => new vscode.Diagnostic(problem.location, problem.message, problem.severity || severity));
    }
}