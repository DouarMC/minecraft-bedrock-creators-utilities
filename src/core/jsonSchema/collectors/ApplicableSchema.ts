import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../../common/types/MinecraftJsonSchema";

export interface ApplicableSchema {
    node: JsonParser.Node;
    inverted?: boolean;
    schema: MinecraftJsonSchema;
}