import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from '../model';
import { SchemaCollector } from './schemaCollector';
import { ValidationResult } from '../diagnostics/ValidationResult';
import { validate } from '../diagnostics/doValidation';
import { ValidationContext } from '../model/ValidationContext';

export interface IApplicableSchema {
    node: JsonParser.Node;
    inverted?: boolean;
    schema: MinecraftJsonSchema;
}

export function getMatchingSchemas(schema: MinecraftJsonSchema, document: vscode.TextDocument, rootNode?: JsonParser.Node, focusOffset: number = -1, exclude?: JsonParser.Node): IApplicableSchema[] {
    if (rootNode) {
        const matchingSchemas = new SchemaCollector(focusOffset, exclude);
        const validationContext: ValidationContext = {
            document,
            rootSchema: schema,
            collector: matchingSchemas
        };
        validate(rootNode, schema, new ValidationResult(), validationContext);
        return matchingSchemas.schemas;
    }
    return [];
}