import { MinecraftAddonPackType } from "../core/minecraft/models/MinecraftTypes";

export interface AddonStructureOptions {
    packTypes: MinecraftAddonPackType[];
    behaviorPackModuleTypes: ("script" | "data")[];
    scriptApiModules?: Record<string, { version: string, npmVersion: string }>;
}
