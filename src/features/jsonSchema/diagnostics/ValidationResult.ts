import * as vscode from 'vscode';

export enum ErrorCode {
	Undefined = 0,
	EnumValueMismatch = 1,
	Deprecated = 2,
	UnexpectedEndOfComment = 0x101,
	UnexpectedEndOfString = 0x102,
	UnexpectedEndOfNumber = 0x103,
	InvalidUnicode = 0x104,
	InvalidEscapeCharacter = 0x105,
	InvalidCharacter = 0x106,
	PropertyExpected = 0x201,
	CommaExpected = 0x202,
	ColonExpected = 0x203,
	ValueExpected = 0x204,
	CommaOrCloseBacketExpected = 0x205,
	CommaOrCloseBraceExpected = 0x206,
	TrailingComma = 0x207,
	DuplicateKey = 0x208,
	CommentNotPermitted = 0x209,
	PropertyKeysMustBeDoublequoted = 0x210,
	SchemaResolveError = 0x300,
	SchemaUnsupportedFeature = 0x301
}

export interface IProblem {
	location: vscode.Range;
	severity?: vscode.DiagnosticSeverity;
    code?: ErrorCode;
	message: string;
}

/**
 * Cette classe sert à accumuler et organiser les résultats de la validation d’un nœud JSON par rapport à un schéma. 
 */
export class ValidationResult {
	public problems: IProblem[];

	public propertiesMatches: number;
	public processedProperties: Set<string>;
	public propertiesValueMatches: number;
	public primaryValueMatches: number;
	public enumValueMatch: boolean;
	public enumValues: any[] | undefined;

	constructor() {
		this.problems = [];
		this.propertiesMatches = 0;
		this.processedProperties = new Set();
		this.propertiesValueMatches = 0;
		this.primaryValueMatches = 0;
		this.enumValueMatch = false;
		this.enumValues = undefined;
	}

	public hasProblems(): boolean {
		return !!this.problems.length;
	}

	public merge(validationResult: ValidationResult): void {
		this.problems = this.problems.concat(validationResult.problems);
		this.propertiesMatches += validationResult.propertiesMatches;
		this.propertiesValueMatches += validationResult.propertiesValueMatches;
		this.mergeProcessedProperties(validationResult);
	}

	public mergeEnumValues(validationResult: ValidationResult): void {
		if (!this.enumValueMatch && !validationResult.enumValueMatch && this.enumValues && validationResult.enumValues) {
			this.enumValues = this.enumValues.concat(validationResult.enumValues);
		}
	}

	public updateEnumMismatchProblemMessages(): void {
		if (!this.enumValueMatch && this.enumValues) {
			for (const error of this.problems) {
				if (error.code === ErrorCode.EnumValueMismatch) {
					error.message = `Value is not accepted. Valid values: ${this.enumValues.map(v => JSON.stringify(v)).join(', ')}.`;
				}
			}
		}
	}

	public mergePropertyMatch(propertyValidationResult: ValidationResult): void {
		this.problems = this.problems.concat(propertyValidationResult.problems);
		this.propertiesMatches++;
		if (propertyValidationResult.enumValueMatch || !propertyValidationResult.hasProblems() && propertyValidationResult.propertiesMatches) {
			this.propertiesValueMatches++;
		}
		if (propertyValidationResult.enumValueMatch && propertyValidationResult.enumValues && propertyValidationResult.enumValues.length === 1) {
			this.primaryValueMatches++;
		}
	}

	public mergeProcessedProperties(validationResult: ValidationResult): void {
		validationResult.processedProperties.forEach(p => this.processedProperties.add(p));
	}

	public compare(other: ValidationResult): number {
		const hasProblems = this.hasProblems();
		if (hasProblems !== other.hasProblems()) {
			return hasProblems ? -1 : 1;
		}
		if (this.enumValueMatch !== other.enumValueMatch) {
			return other.enumValueMatch ? -1 : 1;
		}
		if (this.primaryValueMatches !== other.primaryValueMatches) {
			return this.primaryValueMatches - other.primaryValueMatches;
		}
		if (this.propertiesValueMatches !== other.propertiesValueMatches) {
			return this.propertiesValueMatches - other.propertiesValueMatches;
		}
		return this.propertiesMatches - other.propertiesMatches;
	}
}