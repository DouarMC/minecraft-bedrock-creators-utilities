import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema, MinecraftJsonSchemaType } from '../../../common/types/MinecraftJsonSchema';
import { SchemaCollector } from './collectors/SchemaCollector';
import { ValidationContext } from './ValidationContext';
import { ValidationResult } from './ValidationResult';
import { ErrorCode } from './ErrorCode';
import { SchemaCollectorLike } from './collectors/SchemaCollectorLike';
import { isBoolean } from 'lodash';
import { NoOpSchemaCollector } from './collectors/NoOpSchemaCollector';
import { IApplicableSchema } from './IApplicableSchema';

export class SchemaUtils {
    public static getNodeFromOffset(rootNode: JsonParser.Node | undefined, offset: number, includeRightBound = false): JsonParser.Node | undefined {
        if (rootNode) {
            return JsonParser.findNodeAtOffset(rootNode, offset, includeRightBound);
        }

        return undefined;
    }

    public static isInComment(document: vscode.TextDocument, start: number, offset: number): boolean {
        const scanner = JsonParser.createScanner(document.getText(), false);
        scanner.setPosition(start);
        let token = scanner.scan();
        while (token !== JsonParser.SyntaxKind.EOF && (scanner.getTokenOffset() + scanner.getTokenLength() < offset)) {
            token = scanner.scan();
        }
        return (token === JsonParser.SyntaxKind.LineCommentTrivia || token === JsonParser.SyntaxKind.BlockCommentTrivia) && scanner.getTokenOffset() <= offset;
    }

    public static getCurrentWord(document: vscode.TextDocument, offset: number): string {
        let i = offset - 1;
        const text = document.getText();
        while (i >= 0 && ' \t\n\r\v":{[,]}'.indexOf(text.charAt(i)) === -1) {
            i--;
        }
        return text.substring(i + 1, offset);
    }

    public static getMatchingSchemas(schema: MinecraftJsonSchema, document: vscode.TextDocument, rootNode?: JsonParser.Node, focusOffset: number = -1, exclude?: JsonParser.Node): IApplicableSchema[] {
        if (rootNode) {
            const matchingSchemas = new SchemaCollector(focusOffset, exclude);
            const validationContext: ValidationContext = {
                document,
                rootSchema: schema,
                collector: matchingSchemas
            };
            this.validate(rootNode, schema, new ValidationResult(), validationContext);
            return matchingSchemas.schemas;
        }

        return [];
    }

    public static contains(node: JsonParser.Node, offset: number, includeRightBound = false): boolean {
        return offset >= node.offset && offset < (node.offset + node.length) || includeRightBound && offset === (node.offset + node.length);
    }

    public static isNumber(value: any): value is number {
        return typeof value === 'number';
    }

    public static isBoolean(value: any): value is boolean {
        return typeof value === 'boolean';
    }

    public static isString(value: any): value is string {
        return typeof value === 'string';
    }

    public static stringLength(str: string): number {
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            count++;
            const code = str.charCodeAt(i);
            if (0xD800 <= code && code <= 0xDBFF) {
                i++;
            }
        }
        return count;
    }

    public static extendedRegExp(pattern: string): RegExp | undefined {
        let flags = '';
        if (this.startsWith(pattern, '(?i)')) {
            pattern = pattern.substring(4);
            flags = 'i';
        }
        try {
            return new RegExp(pattern, flags + 'u');
        } catch (e) {
            try {
                return new RegExp(pattern, flags);
            } catch (e) {
                return undefined;
            }
        }
    }

    public static startsWith(haystack: string, needle: string): boolean {
        if (haystack.length < needle.length) {
            return false;
        }

        for (let i = 0; i < needle.length; i++) {
            if (haystack[i] !== needle[i]) {
                return false;
            }
        }

        return true;
    }

    public static validate(node: JsonParser.Node, schema: MinecraftJsonSchema, validationResult: ValidationResult, validationContext: ValidationContext): void {
        if (schema.$ref !== undefined) {
            const resolvedSchema = this.resolveRef(validationContext.rootSchema, schema.$ref);
            if (resolvedSchema) {
                this.validate(node, resolvedSchema, validationResult, validationContext);
                return;
            }
        }

        if (node.type === "property") {
            return this.validate(node.children![1], schema, validationResult, validationContext);
        }

        _validateNode();

        switch (node.type) {
            case "object":
                _validateObjectNode(node);
                break;
            case "array":
                _validateArrayNode(node);
                break;
            case "string":
                _validateStringNode(node);
                break;
            case "number":
                _validateNumberNode(node);
                break;
        }

        validationContext.collector.add({ node: node, schema: schema });

        function _validateNode() {
            function matchesType(type: MinecraftJsonSchemaType): boolean {
                switch (type) {
                    case "string": return node.type === "string";
                    case "number": return node.type === "number";
                    case "integer": return node.type === "number" && Number.isInteger(node.value);
                    case "boolean": return node.type === "boolean";
                    case "object": return node.type === "object";
                    case "array": return node.type === "array";
                    case "null": return node.type === "null";
                    case "molang": return node.type === "string" || node.type === "number" || node.type === "boolean";
                    default: return true;
                }
            }

            if (schema.type !== undefined) {
                if (matchesType(schema.type) === false) {
                    validationResult.problems.push({
                        location: new vscode.Range(
                            validationContext.document.positionAt(node.offset),
                            validationContext.document.positionAt(node.offset + node.length)
                        ),
                        message: `Incorrect type. Expected "${schema.type}".`,
                        code: ErrorCode.Undefined
                    });
                }
            }

            const testAlternatives = (alternatives: MinecraftJsonSchema[], maxOneMatch: boolean) => {
                const matches: MinecraftJsonSchema[] = [];
                
                let bestMatch: {
                    schema: MinecraftJsonSchema;
                    validationResult: ValidationResult;
                    matchingSchemas: SchemaCollectorLike;
                } | undefined = undefined;

                for (const subSchema of alternatives) {
                    const subValidationResult = new ValidationResult();

                    const subMatchingSchemas = validationContext.collector.newSub();
                    const subContext: ValidationContext = {
                        ...validationContext,
                        collector: subMatchingSchemas
                    };
                    SchemaUtils.validate(node, subSchema, subValidationResult, subContext);

                    if (! subValidationResult.hasProblems() ) {
                        matches.push(subSchema);
                    }
                    if (! bestMatch) {
                        bestMatch = {
                            schema: subSchema,
                            validationResult: subValidationResult,
                            matchingSchemas: subMatchingSchemas
                        };
                    } else {
                        if (! maxOneMatch && ! subValidationResult.hasProblems() && ! bestMatch.validationResult.hasProblems()) {
                            bestMatch.matchingSchemas.merge(subMatchingSchemas);
                            bestMatch.validationResult.propertiesMatches += subValidationResult.propertiesMatches;
                            bestMatch.validationResult.propertiesValueMatches += subValidationResult.propertiesValueMatches;
                            bestMatch.validationResult.mergeProcessedProperties(subValidationResult);
                        } else {
                            const compareResult = subValidationResult.compare(bestMatch.validationResult);
                            if (compareResult > 0) {
                                bestMatch = {
                                    schema: subSchema,
                                    validationResult: subValidationResult,
                                    matchingSchemas: subMatchingSchemas
                                };
                            } else if (compareResult === 0) {
                                bestMatch.matchingSchemas.merge(subMatchingSchemas);
                                bestMatch.validationResult.mergeEnumValues(subValidationResult);
                            }
                        }
                    }
                }

                if (matches.length > 1 && maxOneMatch) {
                    validationResult.problems.push({
                        location: new vscode.Range(
                            validationContext.document.positionAt(node.offset),
                            validationContext.document.positionAt(node.offset + 1)
                        ),
                        message: "Matches multiple schemas when only one must validate.",
                        code: ErrorCode.SchemaResolveError
                    });
                }

                if (bestMatch) {
                    bestMatch.validationResult.updateEnumMismatchProblemMessages();
                    validationResult.merge(bestMatch.validationResult);
                    validationContext.collector.merge(bestMatch.matchingSchemas);
                }

                return matches.length;
            };

            if (Array.isArray(schema.oneOf)) {
                testAlternatives(schema.oneOf, true);
            }

            if (Array.isArray(schema.enum)) {
                const value = node.value;
                let enumValueMatch = false;
                for (const e of schema.enum) {
                    if (e === value) {
                        enumValueMatch = true;
                        break;
                    }
                }
                validationResult.enumValues = schema.enum;
                validationResult.enumValueMatch = enumValueMatch;
                if (! enumValueMatch) {
                    validationResult.problems.push({
                        location: new vscode.Range(
                            validationContext.document.positionAt(node.offset),
                            validationContext.document.positionAt(node.offset + node.length)
                        ),
                        message: `Value is not accepted. Valid values: ${schema.enum.map(v => JSON.stringify(v)).join(', ')}.`,
                        code: ErrorCode.EnumValueMismatch
                    });
                }
            }

            if (schema.const !== undefined) {
                const value = node.value;
                if (schema.const !== value) {
                    validationResult.problems.push({
                        location: new vscode.Range(
                            validationContext.document.positionAt(node.offset),
                            validationContext.document.positionAt(node.offset + node.length)
                        ),
                        message: `Value must be ${JSON.stringify(schema.const)}.`
                    });
                    validationResult.enumValueMatch = false;
                } else {
                    validationResult.enumValueMatch = true;
                }
                validationResult.enumValues = [schema.const];
            }
        }

        function _validateNumberNode(node: JsonParser.Node): void {
            const value = node.value;

            function normalizeFloats(float: number): { value: number, multiplier: number } | null {
                const parts = /^(-?\d+)(?:\.(\d+))?(?:e([-+]\d+))?$/.exec(float.toString());
                return parts && {
                    value: Number(parts[1] + (parts[2] || '')),
                    multiplier: (parts[2]?.length || 0) - (parseInt(parts[3]) || 0)
                };
            };

            if (SchemaUtils.isNumber(schema.multipleOf)) {
                let remainder: number = -1;
                if (Number.isInteger(schema.multipleOf)) {
                    remainder = value % schema.multipleOf;
                } else {
                    let normMultipleOf = normalizeFloats(schema.multipleOf);
                    let normValue = normalizeFloats(value);
                    if (normMultipleOf && normValue) {
                        const multiplier = 10 ** Math.abs(normValue.multiplier - normMultipleOf.multiplier);
                        if (normValue.multiplier < normMultipleOf.multiplier) {
                            normValue.value *= multiplier;
                        } else {
                            normMultipleOf.value *= multiplier;
                        }
                        remainder = normValue.value % normMultipleOf.value;
                    }
                }
                if (remainder !== 0) {
                    validationResult.problems.push({
                        location: new vscode.Range(
                            validationContext.document.positionAt(node.offset),
                            validationContext.document.positionAt(node.offset + node.length)
                        ),
                        message: `Value is not divisible by ${schema.multipleOf}.`,
                        code: ErrorCode.SchemaUnsupportedFeature
                    });
                }
            }

            function getExclusiveLimit(limit: number | undefined, exclusive: boolean | number | undefined): number | undefined {
                if (SchemaUtils.isNumber(exclusive)) {
                    return exclusive;
                }
                if (SchemaUtils.isBoolean(exclusive) && exclusive) {
                    return limit;
                }
                return undefined;
            }

            function getLimit(limit: number | undefined, exclusive: boolean | number | undefined): number | undefined {
                if (! isBoolean(exclusive) || ! exclusive) {
                    return limit;
                }
                return undefined;
            }

            const exclusiveMinimum = getExclusiveLimit(schema.minimum, schema.exclusiveMinimum);
            if (SchemaUtils.isNumber(exclusiveMinimum) && value <= exclusiveMinimum) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Value is below the exclusive minimum of ${exclusiveMinimum}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            const exclusiveMaximum = getExclusiveLimit(schema.maximum, schema.exclusiveMaximum);
            if (SchemaUtils.isNumber(exclusiveMaximum) && value >= exclusiveMaximum) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Value is above the exclusive maximum of ${exclusiveMaximum}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            const minimum = getLimit(schema.minimum, schema.exclusiveMinimum);
            if (SchemaUtils.isNumber(minimum) && value < minimum) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Value is below the minimum of ${minimum}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            const maximum = getLimit(schema.maximum, schema.exclusiveMaximum);
            if (SchemaUtils.isNumber(maximum) && value > maximum) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Value is above the maximum of ${maximum}.`,
                    code: ErrorCode.ValueExpected
                });
            }
        }

        function _validateStringNode(node: JsonParser.Node): void {
            if (SchemaUtils.isNumber(schema.minLength) && SchemaUtils.stringLength(node.value) < schema.minLength) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `String is shorter than the minimum length of ${schema.minLength}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            if (SchemaUtils.isNumber(schema.maxLength) && SchemaUtils.stringLength(node.value) > schema.maxLength) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `String is longer than the maximum length of ${schema.maxLength}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            if (SchemaUtils.isString(schema.pattern)) {
                const regExp = SchemaUtils.extendedRegExp(schema.pattern);
                if (regExp && ! regExp.test(node.value)) {
                    validationResult.problems.push({
                        location: new vscode.Range(
                            validationContext.document.positionAt(node.offset),
                            validationContext.document.positionAt(node.offset + node.length)
                        ),
                        message: `String does not match the pattern of ${schema.pattern}.`,
                        code: ErrorCode.InvalidCharacter
                    });
                }
            }
        }

        function _validateArrayNode(node: JsonParser.Node): void {
            if (schema.items) {
                if (Array.isArray(schema.items)) {
                    for (let i = 0; i < schema.items.length; i++) {
                        const subSchema = schema.items[i];
                        const itemValidationResult = new ValidationResult();
                        const item = node.children![i];
                        if (item) {
                            SchemaUtils.validate(item, subSchema, itemValidationResult, validationContext);
                            validationResult.mergePropertyMatch(itemValidationResult);
                        }
                        validationResult.processedProperties.add(String(i));
                    }
                } else if (typeof schema.items === 'object') {
                    for (let i = 0; i < node.children!.length; i++) {
                        const itemValidationResult = new ValidationResult();
                        SchemaUtils.validate(node.children![i], schema.items, itemValidationResult, validationContext);
                        validationResult.mergePropertyMatch(itemValidationResult);
                        validationResult.processedProperties.add(String(i));
                    }
                }
            }

            if (SchemaUtils.isNumber(schema.minItems) && node.children!.length < schema.minItems) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Array has too few items. Expected ${schema.minItems} or more.`,
                    code: ErrorCode.ValueExpected
                });
            }

            if (SchemaUtils.isNumber(schema.maxItems) && node.children!.length > schema.maxItems) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Array has too many items. Expected ${schema.maxItems} or fewer.`,
                    code: ErrorCode.ValueExpected
                });
            }
        }

        function _validateObjectNode(node: JsonParser.Node): void {
            const seenKeys: { [key: string]: JsonParser.Node | undefined } = Object.create(null);
            const unprocessedProperties: Set<string> = new Set();
            for (const propertyNode of node.children ?? []) {
                if (propertyNode.type !== "property" || !propertyNode.children || propertyNode.children.length < 2) continue;
                const keyNode = propertyNode.children[0];
                const valueNode = propertyNode.children[1];
                const key = keyNode.value;
                seenKeys[key] = valueNode;
                unprocessedProperties.add(key);
            }

            if (Array.isArray(schema.required)) {
                for (const propertyName of schema.required) {
                    if (! seenKeys[propertyName]) {
                        validationResult.problems.push({
                            location: new vscode.Range(
                                validationContext.document.positionAt(node.offset),
                                validationContext.document.positionAt(node.offset + 1)
                            ),
                            message: `Missing property "${propertyName}".`,
                            code: ErrorCode.PropertyExpected
                        });
                    }
                }
            }

            const propertyProcessed = (prop: string) => {
                unprocessedProperties.delete(prop);
                validationResult.processedProperties.add(prop);
            };

            if (schema.properties) {
                for (const propertyName of Object.keys(schema.properties)) {
                    propertyProcessed(propertyName);
                    const propertySchema = schema.properties[propertyName];
                    const child = seenKeys[propertyName];
                    if (child) {
                        if (SchemaUtils.isBoolean(propertySchema)) {
                            if (! propertySchema) {
                                for (const propertyNode of node.children ?? []) {
                                    if (propertyNode.type === "property" && propertyNode.children && propertyNode.children[0].value === propertyName) {
                                        const keyNode = propertyNode.children[0];
                                        validationResult.problems.push({
                                            location: new vscode.Range(
                                                validationContext.document.positionAt(keyNode.offset),
                                                validationContext.document.positionAt(keyNode.offset + keyNode.length)
                                            ),
                                            message: `Property ${propertyName} is not allowed.`,
                                            code: ErrorCode.DuplicateKey
                                        });
                                        break;
                                    }
                                }
                            } else {
                                validationResult.propertiesMatches++;
                                validationResult.propertiesValueMatches++;
                            }
                        } else {
                            const propertyValidationResult = new ValidationResult();
                            SchemaUtils.validate(child, propertySchema, propertyValidationResult, validationContext);
                            validationResult.mergePropertyMatch(propertyValidationResult);
                        }
                    }
                }
            }

            if (schema.additionalProperties !== undefined) {
                for (const propertyName of unprocessedProperties) {
                    propertyProcessed(propertyName);
                    const child = seenKeys[propertyName];
                    if (child && typeof schema.additionalProperties === "object") {
                        const propertyValidationResult = new ValidationResult();
                        SchemaUtils.validate(child, schema.additionalProperties, propertyValidationResult, validationContext);
                        validationResult.mergePropertyMatch(propertyValidationResult);
                    }
                }
            }

            if (SchemaUtils.isNumber(schema.maxProperties) && (node.children?.length ?? 0) > schema.maxProperties) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Object has more properties than the limit of ${schema.maxProperties}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            if (SchemaUtils.isNumber(schema.minProperties) && (node.children?.length ?? 0) < schema.minProperties) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        validationContext.document.positionAt(node.offset),
                        validationContext.document.positionAt(node.offset + node.length)
                    ),
                    message: `Object has fewer properties than the minimum of ${schema.minProperties}.`,
                    code: ErrorCode.ValueExpected
                });
            }

            if (schema.propertyNames !== undefined) {
                for (const propertyNode of node.children ?? []) {
                    if (propertyNode.type === "property" && propertyNode.children && propertyNode.children.length > 0) {
                        const keyNode = propertyNode.children[0];

                        const subContext: ValidationContext = {
                            ...validationContext,
                            collector: NoOpSchemaCollector.instance
                        };

                        SchemaUtils.validate(keyNode, schema.propertyNames, validationResult, subContext);
                    }
                }
            }
        }
    }

    public static resolveRef(schemaRoot: MinecraftJsonSchema, ref: string): MinecraftJsonSchema | undefined {
        if (!ref.startsWith('#/')) return undefined;
        const path = ref.substring(2).split('/');
        let current: any = schemaRoot;
        for (const segment of path) {
            if (current && typeof current === 'object') {
                current = current[segment];
            } else {
                return undefined;
            }
        }

        return current;
    }

    public static getOverwriteRange(document: vscode.TextDocument, node: JsonParser.Node | undefined, position: vscode.Position, currentWord: string): vscode.Range {
        const text = document.getText();
        if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
            return new vscode.Range(
                document.positionAt(node.offset),
                document.positionAt(node.offset + node.length)
            );
        } else {
            let overwriteStart = document.offsetAt(position) - currentWord.length;
            if (overwriteStart > 0 && text[overwriteStart - 1] === '"') {
                overwriteStart--;
            }

            return new vscode.Range(
                document.positionAt(overwriteStart),
                position
            );
        }
    }

    public static evaluateSeparatorAfter(document: vscode.TextDocument, offset: number): string {
        const scanner = JsonParser.createScanner(document.getText(), true);
        scanner.setPosition(offset);
        const token = scanner.scan();
        switch (token) {
            case JsonParser.SyntaxKind.CommaToken:
            case JsonParser.SyntaxKind.CloseBraceToken:
            case JsonParser.SyntaxKind.CloseBracketToken:
            case JsonParser.SyntaxKind.EOF:
                return '';
            default:
                return ', ';
        }
    }

    public static findItemAtOffset(node: JsonParser.Node, document: vscode.TextDocument, offset: number) {
        const scanner = JsonParser.createScanner(document.getText(), true);
        const children = node.children!;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (offset > child.offset + child.length) {
                scanner.setPosition(child.offset + child.length);
                const token = scanner.scan();
                if (token === JsonParser.SyntaxKind.CommaToken && offset >= scanner.getTokenOffset() + scanner.getTokenLength()) {
                    return i + 1; // next item
                }
                return i; // current item
            } else if (offset >= child.offset) {
                return i; // current item
            }
        }
        return 0; // first item
    }

    public static collectTypes(schema: MinecraftJsonSchema, types: {[type: string]: boolean}) {
        if (Array.isArray(schema.enum) || schema.const !== undefined) {
            return;
        }
        const type = schema.type;
        if (Array.isArray(type)) {
            type.forEach(t => types[t] = true);
        } else if (type) {
            types[type] = true;
        }
    }
}