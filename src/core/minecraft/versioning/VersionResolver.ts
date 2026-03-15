import { cloneDeep, set, unset } from "lodash";
import { VersionedSchema } from "../../../../common/types/VersionedSchema";
import { MinecraftJsonSchema } from "../../../../common/types/MinecraftJsonSchema";

/**
 * Classe responsable de la résolution des schémas Minecraft selon les versions.
 */
export class VersionResolver {
    /**
     * Applique les patchs au schéma de base selon la version.
     */
    public static resolve(versionedSchema: VersionedSchema, formatVersion?: string | number): MinecraftJsonSchema {
        const schema = cloneDeep(versionedSchema.baseSchema);

        if (! formatVersion || ! versionedSchema.versionedChanges) {
            return schema;
        }

        for (const changeSet of versionedSchema.versionedChanges) {
            if (this.compare(formatVersion, changeSet.version) >= 0) {
                for (const change of changeSet.changes) {
                    const value = cloneDeep(change.value);
                    switch (change.action) {
                        case "add":
                        case "modify":
                            set(schema, change.target, value);
                            break;
                        case "remove":
                            unset(schema, change.target);
                            break;
                    }
                }
            }
        }

        return schema;
    }

    /**
     * Compare deux versions (logique pure).
     */
    public static compare(a: string | number, b: string | number): number {
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
        }

        return (a > b) ? 1 : (a < b ? -1 : 0);
    }
}