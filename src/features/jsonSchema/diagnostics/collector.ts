import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from '../types/minecraftJsonSchema';
import { contains } from '../utils/validationHelpers';

export interface IApplicableSchema {
    node: JsonParser.Node;
    inverted?: boolean;
    schema: MinecraftJsonSchema;
}

export interface ISchemaCollector {
    schemas: IApplicableSchema[];
    add(schema: IApplicableSchema): void;
    merge(other: ISchemaCollector): void;
    include(node: JsonParser.Node): boolean;
    newSub(): ISchemaCollector;
}

export class SchemaCollector implements ISchemaCollector {
    schemas: IApplicableSchema[] = [];
    constructor(private focusOffset = -1, private exclude?: JsonParser.Node) {
    }
    add(schema: IApplicableSchema) {
        this.schemas.push(schema);
    }
    merge(other: ISchemaCollector) {
        Array.prototype.push.apply(this.schemas, other.schemas);
    }
    include(node: JsonParser.Node) {
        return (this.focusOffset === -1 || contains(node, this.focusOffset)) && (node !== this.exclude);
    }
    newSub(): ISchemaCollector {
        return new SchemaCollector(-1, this.exclude);
    }
}

export class NoOpSchemaCollector implements ISchemaCollector {
    private constructor() { }
    get schemas() { return []; }
    add(_schema: IApplicableSchema) { }
    merge(_other: ISchemaCollector) { }
    include(_node: JsonParser.Node) { return true; }
    newSub(): ISchemaCollector { return this; }

    static instance = new NoOpSchemaCollector();
}