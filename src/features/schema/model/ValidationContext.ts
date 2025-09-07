import * as vscode from "vscode";
import { MinecraftJsonSchema } from "./MinecraftJsonSchema";
import { SchemaCollectorLike } from "../utils/schemaCollector";

export interface ValidationContext {
    document: vscode.TextDocument;
    rootSchema: MinecraftJsonSchema;
    collector: SchemaCollectorLike;
}