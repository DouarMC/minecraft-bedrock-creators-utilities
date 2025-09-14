import { randomUUID } from "crypto";
import { MinecraftAddonPack } from "../../../../types/projectConfig";

/**
 * Crée un objet de manifeste de base pour un pack.
 * @param type Le type de pack ("behavior_pack" ou "resource_pack")
 */
export function createManifestObject(type: MinecraftAddonPack): any {
    const isBehaviorPack = type === MinecraftAddonPack.BehaviorPack;

    return {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: randomUUID(),
            version: [0, 0, 1],
            min_engine_version: [1, 21, 100]
        },
        modules: [
            {
                type: isBehaviorPack ? "data" : "resources",
                uuid: randomUUID(),
                version: [0, 0, 1]
            }
        ]
    };
}