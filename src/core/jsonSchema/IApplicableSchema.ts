import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";

export interface IApplicableSchema {
    node: JsonParser.Node;
    inverted?: boolean;
    schema: MinecraftJsonSchema;
}