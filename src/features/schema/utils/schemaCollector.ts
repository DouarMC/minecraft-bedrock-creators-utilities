import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from '../model';
import { contains } from './validationHelpers';

export interface ApplicableSchema {
    node: JsonParser.Node;
    inverted?: boolean;
    schema: MinecraftJsonSchema;
}

export interface SchemaCollectorLike {
    schemas: ApplicableSchema[];
    add(schema: ApplicableSchema): void;
    merge(other: SchemaCollectorLike): void;
    include(node: JsonParser.Node): boolean;
    newSub(): SchemaCollectorLike;
}

export class SchemaCollector implements SchemaCollectorLike {
    schemas: ApplicableSchema[] = [];
    constructor(private focusOffset = -1, private exclude?: JsonParser.Node) {
    }
    add(schema: ApplicableSchema) {
        this.schemas.push(schema);
    }
    merge(other: SchemaCollectorLike) {
        Array.prototype.push.apply(this.schemas, other.schemas);
    }
    include(node: JsonParser.Node) {
        return (this.focusOffset === -1 || contains(node, this.focusOffset)) && (node !== this.exclude);
    }
    newSub(): SchemaCollectorLike {
        return new SchemaCollector(-1, this.exclude);
    }
}

export class NoOpSchemaCollector implements SchemaCollectorLike {
    private constructor() { }
    get schemas() { return []; }
    add(_schema: ApplicableSchema) { }
    merge(_other: SchemaCollectorLike) { }
    include(_node: JsonParser.Node) { return true; }
    newSub(): SchemaCollectorLike { return this; }

    static instance = new NoOpSchemaCollector();
}