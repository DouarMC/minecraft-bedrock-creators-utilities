import { MinecraftAddonPackType, MinecraftProduct } from "../../core/minecraft/models/MinecraftTypes";
import { AddonStructureOptions } from "../../types/addonProjectSetup";

export type AddonSetupCancellationReason = "pack-types" | "behavior-pack-module-types";

export type AddonSetupPromptResult =
    | { status: "cancelled", reason: AddonSetupCancellationReason }
    | { status: "ready", options: AddonStructureOptions };

export interface AddonSetupPrompts {
    askAddonPackTypes(): Promise<MinecraftAddonPackType[]>;
    askBehaviorPackModuleTypes(): Promise<("script" | "data")[]>;
    askScriptApiModules(minecraftProduct: MinecraftProduct): Promise<AddonStructureOptions["scriptApiModules"]>;
}

export async function collectAddonSetupOptions(
    minecraftProduct: MinecraftProduct,
    prompts: AddonSetupPrompts
): Promise<AddonSetupPromptResult> {
    const packTypes = await prompts.askAddonPackTypes();
    if (packTypes.length === 0) {
        return { status: "cancelled", reason: "pack-types" };
    }

    const behaviorPackModuleTypes = packTypes.includes("behavior_pack")
        ? await prompts.askBehaviorPackModuleTypes()
        : [];
    if (packTypes.includes("behavior_pack") && behaviorPackModuleTypes.length === 0) {
        return { status: "cancelled", reason: "behavior-pack-module-types" };
    }

    const scriptApiModules = behaviorPackModuleTypes.includes("script")
        ? await prompts.askScriptApiModules(minecraftProduct)
        : undefined;

    return {
        status: "ready",
        options: { packTypes, behaviorPackModuleTypes, scriptApiModules }
    };
}
