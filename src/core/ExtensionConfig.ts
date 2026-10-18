/**
 * Classe de configuration pour l'extension VS Code "Minecraft Bedrock Creators Utilities".
 */
export class ExtensionConfig {
    /**
     * Pseudo de l'utilisateur GitHub pour le projet.
     */
    private static GITHUB_USER = "DouarMC";

    /**
     * Nom du dépôt GitHub pour le projet.
     */
    private static GITHUB_REPO = "minecraft-bedrock-creators-utilities";

    /**
     * URL de base pour accéder aux schémas JSON hébergés sur GitHub Pages.
     */
    public static get SCHEMA_BASE_URL(): string {
        return `https://${this.GITHUB_USER}.github.io/${this.GITHUB_REPO}/`;
    }
}