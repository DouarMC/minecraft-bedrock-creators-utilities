export abstract class MinecraftGame {
    /**
     * Nom du dossier d'installation du jeu Minecraft Bedrock.
     */
    public abstract readonly installFolderName: string;
    /**
     * Nom du dossier des données utilisateur du jeu Minecraft Bedrock.
     */
    public abstract readonly userDataFolderName: string;
}