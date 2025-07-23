export interface ProjectMetadata {
    type: "addon" | "skin_pack" | "world_template";
    id: string;
    displayName: string;
    author: string;
    minecraftProduct: "stable" | "preview";
};