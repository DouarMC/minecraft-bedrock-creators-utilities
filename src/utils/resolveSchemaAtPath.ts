import { getErrorsForSchema } from './resolveMatchingSubSchema'; // adapte le chemin si besoin

export function resolveSchemaAtPath(schema: any, path: string[], rootValue?: any): any {
    let current = schema;
    let currentValue = rootValue;

    for (const segment of path) {
        // 🔁 Si on est dans un tableau et que le segment est un index
        if (/^\d+$/.test(segment)) {
            const index = Number(segment);
            if (Array.isArray(current?.items)) {
                current = current.items[index] ?? (current.additionalItems ?? {});
            } else {
                current = current?.items ?? {};
            }

            if (Array.isArray(currentValue)) {
                currentValue = currentValue[index];
            }

            continue;
        }

        // 🔄 Si on est dans un oneOf/anyOf → on doit choisir dynamiquement
        const match = getErrorsForSchema(current, currentValue ?? {});
        current = match.schema ?? current;

        // Puis on descend dans la propriété demandée
        if (current?.properties?.[segment]) {
            current = current.properties[segment];
        } else if (current?.patternProperties) {
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

        if (typeof currentValue === 'object' && currentValue !== null) {
            currentValue = currentValue[segment];
        }
    }

    return current;
}