import { dynamicExamplesSourceKeys } from "../features/jsonSchema/shared/schemaEnums";

type MinecraftJsonSchemaType = "string" | "boolean" | "number" | "integer" | "array" | "object" | "null" | "molang";

export interface MinecraftJsonSchema {
    type?: MinecraftJsonSchemaType
    default?: any,
    description?: string,
    properties?: MinecraftJsonSchemaMap;
    additionalProperties?: boolean | MinecraftJsonSchema;
    minProperties?: number;
    maxProperties?: number;
    items: MinecraftJsonSchema | MinecraftJsonSchema[];
    minItems?: number;
    maxItems?: number;
    pattern?: string;
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


    "x-dynamic-examples-source"?: keyof typeof dynamicExamplesSourceKeys;
    "x-localized"?: boolean;
    "x-deprecated"?: boolean;
}

export interface MinecraftJsonSchemaMap {
	[name: string]: MinecraftJsonSchema;
}