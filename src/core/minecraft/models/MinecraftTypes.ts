/**
 * Type représentant les différents types de packs Minecraft.
 */
export type MinecraftPackType = "behavior_pack" | "resource_pack" | "skin_pack" | "world_template";

/**
 * Type représentant les différents types de projets Minecraft.
 * @verified
 */
export type MinecraftProjectType = "addon" | "skin_pack" | "world_template";

/**
 * Type représentant les différents produits Minecraft ciblés par les projets.
 * @verified
 */
export type MinecraftProduct = "stable" | "preview";

/**
 * Type représentant les différents types de packs d'addons.
 */
export type MinecraftAddonPackType = "behavior_pack" | "resource_pack";