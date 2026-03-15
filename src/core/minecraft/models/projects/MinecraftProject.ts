import { MinecraftProduct } from "../MinecraftTypes";
import { MinecraftProjectConfig } from "./MinecraftProjectConfig";

export abstract class MinecraftProject {
    public readonly folder: string;

    public config: MinecraftProjectConfig;

    public constructor(projectFolder: string, config: MinecraftProjectConfig) {
        this.folder = projectFolder;
        this.config = config;
    }

    public get id(): string { 
        return this.config.metadata.id; 
    }

    public get minecraftProduct(): MinecraftProduct { 
        return this.config.metadata.minecraftProduct; 
    }

    public get options() { 
        return this.config.options; 
    }
}