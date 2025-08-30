export enum MinecraftProjectType {
    Addon = "addon",
    SkinPack = "skin_pack",
    WorldTemplate = "world_template"
}

export enum MinecraftProduct {
    Stable = "stable",
    Preview = "preview"
}

export enum MinecraftAddonPack {
    BehaviorPack = "behavior_pack",
    ResourcePack = "resource_pack"
}

export interface ProjectMetadata {
    type: MinecraftProjectType;
    id: string;
    displayName: string;
    author: string;
    minecraftProduct: MinecraftProduct;
};

export interface MinecraftProjectConfig {
    metadata: ProjectMetadata;
    options: {
        deploy: {
            prompt_to_launch_minecraft: boolean;
        };
    }
}