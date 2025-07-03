/**
 * Fonction utilitaire pour extraire une valeur depuis un fichier .env simple
 */
export function parseEnvValue(content: string, key: string): string | undefined {
    const match = content.match(new RegExp(`^${key}="?(.*?)"?$`, 'm'));
    return match?.[1];
}