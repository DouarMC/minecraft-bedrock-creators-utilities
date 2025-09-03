import { MinecraftProduct } from "../../types/projectConfig";

export enum MinecraftPackagePrefix {
    Stable = "Microsoft.MinecraftUWP_",
    Preview = "Microsoft.MinecraftWindowsBeta_"
}

export enum MinecraftPackageSuffix {
    Stable = "_x64__8wekyb3d8bbwe",
    Preview = "_x64__8wekyb3d8bbwe"
}

export enum MinecraftPackageFull {
    Stable = "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
    Preview = "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe"
}

/**
 * Configuration associée à chaque produit Minecraft
 */
export interface MinecraftProductConfig {
    prefix: MinecraftPackagePrefix;
    suffix: MinecraftPackageSuffix;
    packageFull: MinecraftPackageFull;
}

/**
 * Table de config des produits Minecraft
 */
export const minecraftProductConfigs: Record<MinecraftProduct, MinecraftProductConfig> = {
    [MinecraftProduct.Stable]: {
        prefix: MinecraftPackagePrefix.Stable,
        suffix: MinecraftPackageSuffix.Stable,
        packageFull: MinecraftPackageFull.Stable
    },
    [MinecraftProduct.Preview]: {
        prefix: MinecraftPackagePrefix.Preview,
        suffix: MinecraftPackageSuffix.Preview,
        packageFull: MinecraftPackageFull.Preview
    }
};