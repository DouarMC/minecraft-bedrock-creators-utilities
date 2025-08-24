import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema, MinecraftJsonSchemaType } from '../types/minecraftJsonSchema';
import { ValidationResult } from './validate';
import { SchemaCollector, IApplicableSchema, ISchemaCollector, NoOpSchemaCollector } from './collector';

import { isNumber, contains, extendedRegExp, isBoolean, isString, startsWith, stringLength } from '../utils/validationHelpers';
import { resolveRef } from '../utils/resolveRef';

export function doValidation(document: vscode.TextDocument, schema: MinecraftJsonSchema, severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Warning): vscode.Diagnostic[] | undefined {
    const root = JsonParser.parseTree(document.getText());
    if (!root) {
        return [];
    }

    const validationResult = new ValidationResult();
    validate(root, schema, validationResult, NoOpSchemaCollector.instance, document, schema); // <-- AJOUTÉ schema en tant que racine
    return validationResult.problems.map(problem => {
        return new vscode.Diagnostic(
            problem.location,
            problem.message,
            problem.severity || severity
        );
    });
}

export function validate(node: JsonParser.Node, schema: MinecraftJsonSchema, validationResult: ValidationResult, matchingSchemas: ISchemaCollector, document: vscode.TextDocument, schemaRoot: MinecraftJsonSchema): void {
	if (schema.$ref !== undefined) {
		const resolvedSchema = resolveRef(schemaRoot, schema.$ref);
		if (resolvedSchema) {
			validate(node, resolvedSchema, validationResult, matchingSchemas, document, schemaRoot);
			return;
		}
	}

    if (node.type === "property") {
        return validate(node.children![1], schema, validationResult, matchingSchemas, document, schemaRoot);
    }

    _validateNode();

    switch (node.type) {
		case 'object':
			_validateObjectNode(node);
			break;
		case 'array':
			_validateArrayNode(node);
			break;
		case 'string':
			_validateStringNode(node);
			break;
		case 'number':
			_validateNumberNode(node);
			break;
	}

	matchingSchemas.add({node: node, schema: schema});

    function _validateNode() {
		/**
		 * Prend un type du schéma et le noeud de validate(), et vérifie si le type du noeud correspond au type attendu.
		 * @param type Le type du schéma à vérifier.
		 * @returns 
		 */
		function matchesType(type: MinecraftJsonSchemaType): boolean {
            switch (type) {
                case "string":
                    return node.type === "string";
                case "number":
                    return node.type === "number";
                case "integer":
                    return node.type === "number" && Number.isInteger(node.value);
                case "boolean":
                    return node.type === "boolean";
                case "object":
                    return node.type === "object";
                case "array":
                    return node.type === "array";
                case "null":
                    return node.type === "null";
                case "molang":
                    return node.type === "string" || node.type === "number" || node.type === "boolean";
                default:
                    return true;
            }
		}

		// Validation si schema.type est défini.
        if (schema.type !== undefined) {
			// Vérifie si le type du noeud correspond au type attendu dans le schéma.
            if (matchesType(schema.type) === false) {
                validationResult.problems.push({
                    location: new vscode.Range(
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + node.length)
                    ),
                    message: `Incorrect type. Expected "${schema.type}".`
                });
            }
        }

		const testAlternatives = (alternatives: MinecraftJsonSchema[], maxOneMatch: boolean) => {
			const matches: MinecraftJsonSchema[] = [];

			// remember the best match that is used for error messages
			let bestMatch: { schema: MinecraftJsonSchema; validationResult: ValidationResult; matchingSchemas: ISchemaCollector; } | undefined = undefined;

			// Pour chaque schéma des alternatives.
			for (const subSchema of alternatives) {
				const subValidationResult = new ValidationResult(); // ValidationResult pour le sous-schéma.

				const subMatchingSchemas = matchingSchemas.newSub();
				validate(node, subSchema, subValidationResult, subMatchingSchemas, document, schemaRoot);
				if (!subValidationResult.hasProblems()) {
					matches.push(subSchema);
				}
				if (!bestMatch) {
					bestMatch = { schema: subSchema, validationResult: subValidationResult, matchingSchemas: subMatchingSchemas };
				} else {
					if (!maxOneMatch && !subValidationResult.hasProblems() && !bestMatch.validationResult.hasProblems()) {
						// no errors, both are equally good matches
						bestMatch.matchingSchemas.merge(subMatchingSchemas);
						bestMatch.validationResult.propertiesMatches += subValidationResult.propertiesMatches;
						bestMatch.validationResult.propertiesValueMatches += subValidationResult.propertiesValueMatches;
						bestMatch.validationResult.mergeProcessedProperties(subValidationResult);
					} else {
						const compareResult = subValidationResult.compare(bestMatch.validationResult);
						if (compareResult > 0) {
							// our node is the best matching so far
							bestMatch = { schema: subSchema, validationResult: subValidationResult, matchingSchemas: subMatchingSchemas };
						} else if (compareResult === 0) {
							// there's already a best matching but we are as good
							bestMatch.matchingSchemas.merge(subMatchingSchemas);
							bestMatch.validationResult.mergeEnumValues(subValidationResult);
						}
					}
				}
			}

			if (matches.length > 1 && maxOneMatch) {
				validationResult.problems.push({
					location: new vscode.Range(
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + 1) // FLAG
                    ),
					message: "Matches multiple schemas when only one must validate."
				});
			}
			if (bestMatch) {
				bestMatch.validationResult.updateEnumMismatchProblemMessages();
				validationResult.merge(bestMatch.validationResult);
				matchingSchemas.merge(bestMatch.matchingSchemas);
			}
			return matches.length;
		};

		// Validation si schema.oneOf.
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
			if (!enumValueMatch) {
				validationResult.problems.push({
					location: new vscode.Range(
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + node.length)
                    ),
					message: `Value is not accepted. Valid values: ${schema.enum.map(v => JSON.stringify(v)).join(', ')}.`
				});
			}
		}

		if (schema.const !== undefined) {
			const value = node.value;
			if (schema.const !== value) {
				validationResult.problems.push({
					location: new vscode.Range(
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + node.length)
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
		if (isNumber(schema.multipleOf)) {
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
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + node.length)
                    ),
					message: `Value is not divisible by ${schema.multipleOf}.`
				});
			}
		}
		function getExclusiveLimit(limit: number | undefined, exclusive: boolean | number | undefined): number | undefined {
			if (isNumber(exclusive)) {
				return exclusive;
			}
			if (isBoolean(exclusive) && exclusive) {
				return limit;
			}
			return undefined;
		}
		function getLimit(limit: number | undefined, exclusive: boolean | number | undefined): number | undefined {
			if (!isBoolean(exclusive) || !exclusive) {
				return limit;
			}
			return undefined;
		}
		const exclusiveMinimum = getExclusiveLimit(schema.minimum, schema.exclusiveMinimum);
		if (isNumber(exclusiveMinimum) && value <= exclusiveMinimum) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `Value is below the exclusive minimum of ${exclusiveMinimum}.`
			});
		}
		const exclusiveMaximum = getExclusiveLimit(schema.maximum, schema.exclusiveMaximum);
		if (isNumber(exclusiveMaximum) && value >= exclusiveMaximum) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `Value is above the exclusive maximum of ${exclusiveMaximum}.`
			});
		}
		const minimum = getLimit(schema.minimum, schema.exclusiveMinimum);
		if (isNumber(minimum) && value < minimum) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `Value is below the minimum of ${minimum}.`
			});
		}
		const maximum = getLimit(schema.maximum, schema.exclusiveMaximum);
		if (isNumber(maximum) && value > maximum) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `Value is above the maximum of ${maximum}.`
			});
		}
	}

    function _validateStringNode(node: JsonParser.Node): void {
		if (isNumber(schema.minLength) && stringLength(node.value) < schema.minLength) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `String is shorter than the minimum length of ${schema.minLength}.`
			});
		}

		if (isNumber(schema.maxLength) && stringLength(node.value) > schema.maxLength) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `String is longer than the maximum length of ${schema.maxLength}.`
			});
		}

		if (isString(schema.pattern)) {
			const regex = extendedRegExp(schema.pattern);
			if (regex && !(regex.test(node.value))) {
				validationResult.problems.push({
					location: new vscode.Range(
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + node.length)
                    ),
					message: `String does not match the pattern of "${schema.pattern}".`
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
                        validate(item, subSchema, itemValidationResult, matchingSchemas, document, schemaRoot);
                        validationResult.mergePropertyMatch(itemValidationResult);
                    }
                    validationResult.processedProperties.add(String(i));
                }
            } else if (typeof schema.items === 'object') {
                for (let i = 0; i < node.children!.length; i++) {
                    const itemValidationResult = new ValidationResult();
                    validate(node.children![i], schema.items, itemValidationResult, matchingSchemas, document, schemaRoot);
                    validationResult.mergePropertyMatch(itemValidationResult);
                    validationResult.processedProperties.add(String(i));
                }
            }
        }

		if (isNumber(schema.minItems) && node.children!.length < schema.minItems) {
			validationResult.problems.push({
				location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
				message: `Array has too few items. Expected ${schema.minItems} or more.`
			});
		}

        if (isNumber(schema.maxItems) && node.children!.length > schema.maxItems) {
            validationResult.problems.push({
                location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
                message: `Array has too many items. Expected ${schema.maxItems} or fewer.`
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
            if (!seenKeys[propertyName]) {
                // On place l'erreur sur l'objet lui-même
                validationResult.problems.push({
                    location: new vscode.Range(
                        document.positionAt(node.offset),
                        document.positionAt(node.offset + 1)
                    ),
                    message: `Missing property "${propertyName}".`
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
                    if (isBoolean(propertySchema)) {
                        if (!propertySchema) {
                            // On place l'erreur sur la clé
                            for (const propertyNode of node.children ?? []) {
                                if (propertyNode.type === "property" && propertyNode.children && propertyNode.children[0].value === propertyName) {
                                    const keyNode = propertyNode.children[0];
                                    validationResult.problems.push({
                                        location: new vscode.Range(
                                            document.positionAt(keyNode.offset),
                                            document.positionAt(keyNode.offset + keyNode.length)
                                        ),
                                        message: `Property ${propertyName} is not allowed.`
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
                        validate(child, propertySchema, propertyValidationResult, matchingSchemas, document, schemaRoot);
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
                    validate(child, schema.additionalProperties, propertyValidationResult, matchingSchemas, document, schemaRoot);
                    validationResult.mergePropertyMatch(propertyValidationResult);
                }
            }
        }

        if (isNumber(schema.maxProperties) && (node.children?.length ?? 0) > schema.maxProperties) {
            validationResult.problems.push({
                location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
                message: `Object has more properties than the limit of ${schema.maxProperties}.`
            });
        }

        if (isNumber(schema.minProperties) && (node.children?.length ?? 0) < schema.minProperties) {
            validationResult.problems.push({
                location: new vscode.Range(
                    document.positionAt(node.offset),
                    document.positionAt(node.offset + node.length)
                ),
                message: `Object has fewer properties than the minimum of ${schema.minProperties}.`
            });
        }

        if (schema.propertyNames !== undefined) {
            for (const propertyNode of node.children ?? []) {
                if (propertyNode.type === "property" && propertyNode.children && propertyNode.children.length > 0) {
                    const keyNode = propertyNode.children[0];
                    validate(keyNode, schema.propertyNames, validationResult, NoOpSchemaCollector.instance, document, schemaRoot);
                }
            }
        }
	}
}