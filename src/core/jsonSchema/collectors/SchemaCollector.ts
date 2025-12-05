import { SchemaUtils } from "../SchemaUtils";
import { ApplicableSchema } from "./ApplicableSchema";
import { SchemaCollectorLike } from "./SchemaCollectorLike";
import * as JsonParser from "jsonc-parser";

export class SchemaCollector implements SchemaCollectorLike {
    schemas: ApplicableSchema[] = [];

    constructor(private focusOffset = -1, private exclude?: JsonParser.Node) {}

    add(schema: ApplicableSchema): void {
        this.schemas.push(schema);
    }

    merge(other: SchemaCollectorLike): void {
        Array.prototype.push.apply(this.schemas, other.schemas);
    }

    include(node: JsonParser.Node): boolean {
        return (this.focusOffset === -1 || SchemaUtils.contains(node, this.focusOffset)) && (node !== this.exclude);
    }

    newSub(): SchemaCollectorLike {
        return new SchemaCollector(-1, this.exclude);
    }
}