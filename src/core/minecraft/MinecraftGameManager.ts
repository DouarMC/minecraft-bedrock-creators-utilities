import { MinecraftPreviewGame } from "./MinecraftPreviewGame";
import { MinecraftStableGame } from "./MinecraftStableGame";


export class MinecraftGameManager {
    private static stableGame: MinecraftStableGame | undefined;
    private static previewGame: MinecraftPreviewGame | undefined;

    public static async initialize(): Promise<void> {
        const stableGame = new MinecraftStableGame();
        const previewGame = new MinecraftPreviewGame();
        
        if (await stableGame.isInstalled()) {
            this.stableGame = stableGame;
        }
        if (await previewGame.isInstalled()) {
            this.previewGame = previewGame;
        }
    }

    /**
     * Récupère l'installation de Minecraft Bedrock Preview.
     * @throws {Error} Si Minecraft Bedrock Preview n'est pas installé.
     * @returns 
     */
    public static getStableGame(): MinecraftStableGame {
        if (! this.stableGame) {
            throw new Error("Minecraft Bedrock Stable n'est pas installé.");
        }

        return this.stableGame;
    }

    /**
     * Récupère l'installation de Minecraft Bedrock Preview.
     * @throws {Error} Si Minecraft Bedrock Preview n'est pas installé.
     * @returns 
     */
    public static getPreviewGame(): MinecraftPreviewGame {
        if (! this.previewGame) {
            throw new Error("Minecraft Bedrock Preview n'est pas installé.");
        }

        return this.previewGame;
    }
}