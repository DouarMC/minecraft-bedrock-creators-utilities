import { MinecraftProduct, MinecraftProjectType } from "../core/minecraft/models/MinecraftTypes";

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