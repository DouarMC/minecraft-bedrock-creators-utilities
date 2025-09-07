export type JsonSchemaType =
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null";

export interface JsonSchema<TJsonType extends string = JsonSchemaType> {
    allOf?: JsonSchema<TJsonType>[];
    anyOf?: JsonSchema<TJsonType>[];
    additionalProperties?: JsonSchema<TJsonType>;
    const?: any;
    default?: any;
    definitions?: { [name: string]: JsonSchema<TJsonType> };
    description?: string;
    enum?: any[];
    examples?: any[];
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    items?: JsonSchema<TJsonType> | JsonSchema<TJsonType>[];
    minimum?: number;
    minItems?: number;
    minLength?: number;
    minProperties?: number;
    maximum?: number;
    maxItems?: number;
    maxLength?: number;
    maxProperties?: number;
    multipleOf?: number;
    oneOf?: JsonSchema<TJsonType>[];
    pattern?: string | string[];
    properties?: Record<string, JsonSchema<TJsonType>>;
    propertyNames?: JsonSchema<TJsonType>;
    required?: string[];
    type?: TJsonType;
    $ref?: string;
}