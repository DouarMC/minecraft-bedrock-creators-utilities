export interface BaseSchema<
    TType extends string,
    TSelf extends BaseSchema<TType, TSelf>
> {
    type?: TType;

    // récursivité
    allOf?: TSelf[];
    anyOf?: TSelf[];
    oneOf?: TSelf[];
    properties?: Record<string, TSelf>;
    additionalProperties?: TSelf;
    items?: TSelf | TSelf[];
    definitions?: { [name: string]: TSelf };
    propertyNames?: TSelf;

    const?: any;
    default?: any;
    description?: string;
    enum?: any[];
    examples?: any[];
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    minimum?: number;
    minItems?: number;
    minLength?: number;
    minProperties?: number;
    maximum?: number;
    maxItems?: number;
    maxLength?: number;
    maxProperties?: number;
    multipleOf?: number;
    pattern?: string | string[];
    required?: string[];
    $ref?: string;
}

export type JsonSchemaType =
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null";

export interface JsonSchema extends BaseSchema<JsonSchemaType, JsonSchema> {}
