import type { MinecraftStableGame, MinecraftPreviewGame } from './core/minecraft-install/MinecraftGame';
import type { MinecraftProject } from './core/project/MinecraftProject';

export const globals = {
    minecraftStableGame: undefined as MinecraftStableGame | undefined,
    minecraftPreviewGame: undefined as MinecraftPreviewGame | undefined,
    currentMinecraftProject: undefined as MinecraftProject | undefined,
};