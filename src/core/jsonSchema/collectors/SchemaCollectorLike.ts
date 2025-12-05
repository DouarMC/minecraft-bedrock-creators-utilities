import { ApplicableSchema } from "./ApplicableSchema";
import * as JsonParser from "jsonc-parser";

export interface SchemaCollectorLike {
    schemas: ApplicableSchema[];
    add(schema: ApplicableSchema): void;
    merge(other: SchemaCollectorLike): void;
    include(node: JsonParser.Node): boolean;
    newSub(): SchemaCollectorLike;
}