import { MinecraftJsonSchema } from "../model";

export function resolveRef(schemaRoot: any, ref: string): MinecraftJsonSchema | undefined {
    if (!ref.startsWith('#/')) return undefined;
    const path = ref.substring(2).split('/');
    let current = schemaRoot;
    for (const segment of path) {
        if (current && typeof current === 'object') {
            current = current[segment];
        } else {
            return undefined;
        }
    }
    return current;
}