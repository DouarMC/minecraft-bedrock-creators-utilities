import { PropertyPath } from "lodash";

export interface SchemaModification {
    target: PropertyPath
    action: "add" | "remove" | "modify";
    value?: any;
    notes?: string;
}

export interface SchemaChange {
    version: string | number; // ex.: "1.21.60" ou 2, 3 pour les manifest.json
    changes: SchemaModification[];
}

export interface SchemaType {
    fileMatch: string[];
    baseSchema: any;
    versionedChanges: SchemaChange[];
    previewVersionedChanges?: SchemaChange[];
}