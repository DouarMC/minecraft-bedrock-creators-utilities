/**
 * Compare deux versions de type "1.18.0", "1.21.60", etc.
 * @param a La première version
 * @param b La deuxième version
 * @returns -1 si a < b, 1 si a > b, 0 si égal
 */
export function compareVersions(a: string, b: string): number {
    // Découpe chaque version en tableau de nombres : "1.21.60" → [1, 21, 60]
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);

    // Compare chaque sous-partie des versions (majeur, mineur, patch)
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0; // Si une version a moins de parties, on remplit avec 0
        const nb = pb[i] || 0;

        // Si une sous-partie est plus grande, on retourne 1 ou -1
        if (na > nb) {
            return 1;
        }
        if (na < nb) {
            return -1;
        }
    }

    // Si toutes les parties sont égales
    return 0;
}