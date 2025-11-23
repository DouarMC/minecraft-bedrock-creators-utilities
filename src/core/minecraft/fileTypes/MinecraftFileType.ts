

export class MinecraftFileType {
    public readonly id: string;
    public readonly packType: "behavior_pack" | "resource_pack" | "skin_pack" | "world_template";
    public readonly displayName: string;

    public readonly patterns: string[];
    readonly excludePatterns?: string[];

    public readonly schema?: {
        base: string;
        versionedChanges?: Record<string, string>;
    };
}