/**
 * Résout une propriété dans un schéma JSON en suivant un chemin donné. Gère aussi les patternProperties si nécessaire.
 * @param schema Le schéma JSON à partir duquel on veut résoudre la propriété.
 * @param path Un tableau de clés représentant le chemin (ex: ["minecraft:block", "components"]).
 * @returns 
 */
export function resolveSchemaAtPath(schema: any, path: string[]): any {
    let current = schema;

    for (const segment of path) {
        // 🔁 Si on est dans un tableau et que le segment est un index
        if (current?.type === "array" && /^\d+$/.test(segment)) {
            if (Array.isArray(current.items)) {
                current = current.items[Number(segment)] ?? {};
            } else {
                current = current.items ?? {};
            }
            continue;
        }

        // 🔍 Propriétés normales
        if (current?.properties?.[segment]) {
            current = current.properties[segment];
        }
        // 🔍 Propriétés avec motifs
        else if (current?.patternProperties) {
            const matched = Object.entries(current.patternProperties)
                .find(([pattern]) => new RegExp(pattern).test(segment));
            if (matched) {
                current = matched[1];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    return current;
}
