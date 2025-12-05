import { ApplicableSchema } from "./ApplicableSchema";
import { SchemaCollectorLike } from "./SchemaCollectorLike";
import * as JsonParser from "jsonc-parser";

export class NoOpSchemaCollector implements SchemaCollectorLike {
    private constructor() {}

    get schemas() { return []; }

    add(_schema: ApplicableSchema) {}
    merge(_other: SchemaCollectorLike) {}
    include(_node: JsonParser.Node) { return true; }
    newSub(): SchemaCollectorLike { return this; }

    static instance = new NoOpSchemaCollector();
}