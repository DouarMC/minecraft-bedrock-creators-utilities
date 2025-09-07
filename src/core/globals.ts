import { MinecraftDataManager } from "./minecraft/MinecraftDataManager";
import type { MinecraftGame } from "./minecraft/MinecraftGame";
import type { MinecraftProject } from './project/MinecraftProject';

export const globals = {
    minecraftStableGame: undefined as MinecraftGame | undefined,
    minecraftPreviewGame: undefined as MinecraftGame | undefined,
    minecraftStableDataManager: undefined as MinecraftDataManager | undefined,
    currentMinecraftProject: undefined as MinecraftProject | undefined,
};