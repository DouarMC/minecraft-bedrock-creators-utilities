/**
 * Contient les différents types des pack minecraft.
 */
export enum MinecraftProjectType {
    Addon = "addon",
    SkinPack = "skin_pack",
    WorldTemplate = "world_template"
}

/**
 * Contient les différents produits Minecraft ciblés par les projets.
 */
export enum MinecraftProduct {
    Stable = "stable",
    Preview = "preview"
}

/**
 * Contient les différents types de pack d'addons.
 */
export enum MinecraftAddonPack {
    BehaviorPack = "behavior_pack",
    ResourcePack = "resource_pack"
}

/**
 * Interface représentant les métadonnées d'un projet Minecraft Bedrock, incluant le type de projet, l'ID, le nom d'affichage, l'auteur et le produit Minecraft ciblé.
 */
export interface ProjectMetadata {
    type: MinecraftProjectType;
    id: string;
    displayName: string;
    author: string;
    minecraftProduct: MinecraftProduct;
};