/**
 * Compare deux versions de format en string.
 * @param a La première version à comparer.
 * @param b La deuxième version à comparer.
 * @returns Résultat de la comparaison (-1, 0, 1)
 */
export function compareVersions(a: string | number, b: string | number): number {
    if (typeof a === "string" && typeof b === "string") {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        const maxLength = Math.max(aParts.length, bParts.length);

        for (let i = 0; i < maxLength; i++) {
            const aNum = aParts[i] ?? 0;
            const bNum = bParts[i] ?? 0;

            if (aNum > bNum) {
                return 1;
            }
            if (aNum < bNum) {
                return -1;
            }
        }

        return 0;
    } else if (typeof a === "number" && typeof b === "number") {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    }

    return 0; // Si les types ne correspondent pas, on considère qu'ils sont égaux
}