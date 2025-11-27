import { MinecraftPackType } from "../MinecraftPackType";
import { MinecraftFileId } from "./MinecraftFileId";

export class MinecraftFileType {
    public readonly id: MinecraftFileId;
    public readonly packType: MinecraftPackType;
    public readonly displayName: string;
    public readonly patterns: string[];
    readonly excludePatterns?: string[];
    public readonly schemaDataUrl?: string;

    public constructor(options: {
        id: MinecraftFileId;
        packType: MinecraftPackType;
        displayName: string;
        patterns: string[];
        excludePatterns?: string[];
        schemaDataUrl?: string;
    }) {
        this.id = options.id;
        this.packType = options.packType;
        this.displayName = options.displayName;
        this.patterns = options.patterns;
        this.excludePatterns = options.excludePatterns;
        this.schemaDataUrl = options.schemaDataUrl;
    }
}