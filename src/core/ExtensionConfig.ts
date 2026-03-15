

export class ExtensionConfig {
    private static GITHUB_USER = "DouarMC";
    private static GITHUB_REPO = "minecraft-bedrock-creators-utilities";

    public static get SCHEMA_BASE_URL(): string {
        return `https://${this.GITHUB_USER}.github.io/${this.GITHUB_REPO}/`;
    }
}