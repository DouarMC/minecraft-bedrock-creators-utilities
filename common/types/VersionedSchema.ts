import { PropertyPath } from "lodash";
import { MinecraftJsonSchema } from "./MinecraftJsonSchema";

export interface SchemaChange {
    version: string | number;
    changes: Array<{
        target: PropertyPath;
        action: "add" | "remove" | "modify";
        value?: any;
        notes?: string;
    }>
}

export interface VersionedSchema {
    baseSchema: MinecraftJsonSchema; // on va remplacer le any plus tard
    versionedChanges: SchemaChange[];
}