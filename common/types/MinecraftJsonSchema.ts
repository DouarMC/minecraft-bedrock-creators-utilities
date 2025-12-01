import { BaseSchema, JsonSchemaType } from "./JsonSchema";

export type MinecraftJsonSchemaType = JsonSchemaType | "molang";

export interface MinecraftJsonSchema extends BaseSchema<MinecraftJsonSchemaType, MinecraftJsonSchema> {
    // extensions spécifiques Minecraft
    "x-dynamic-examples-source"?: string | string[];
    "x-experimental_options"?: string[];
    "x-deprecated"?: boolean;
    "x-localized"?: boolean;
}