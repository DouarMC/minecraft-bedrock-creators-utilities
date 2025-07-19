export interface SchemaModification {
    target: string; // ex.: "minecraft:block.components.minecraft:block_light_absorption"
    action: "add" | "remove" | "modify";
    value?: any;
    notes?: string;
}

export interface SchemaChange {
    version: string; // ex.: "1.21.60"
    changes: SchemaModification[];
}

export interface SchemaType {
    fileMatch: string[];
    baseSchema: any;
    versionedChanges: SchemaChange[];
}