export type MinecraftJsonSchemaType = "string" | "number" | "integer" | "boolean" | "object" | "array" | "null" | "molang";

export interface MinecraftJsonSchema {
	type?: MinecraftJsonSchemaType;
	default?: any;
	definitions?: { [name: string]: MinecraftJsonSchema };
	description?: string;
	properties?: MinecraftJsonSchemaMap;
	additionalProperties?: MinecraftJsonSchema;
	minProperties?: number;
	maxProperties?: number;
	items?: MinecraftJsonSchema | MinecraftJsonSchema[];
	minItems?: number;
	maxItems?: number;
	pattern?: string | string[];
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: number;
	exclusiveMaximum?: number;
	multipleOf?: number;
	required?: string[];
	$ref?: string;
	anyOf?: MinecraftJsonSchema[];
	allOf?: MinecraftJsonSchema[];
	oneOf?: MinecraftJsonSchema[];
	enum?: any[];

	const?: any;
	propertyNames?: MinecraftJsonSchema;
	examples?: any[];

	"x-dynamic-examples-source"?: string | string[];
	"x-experimental_options"?: string[];
	"x-deprecated"?: boolean;
	"x-localized"?: boolean;
}

export interface MinecraftJsonSchemaMap {
	[name: string]: MinecraftJsonSchema;
}
