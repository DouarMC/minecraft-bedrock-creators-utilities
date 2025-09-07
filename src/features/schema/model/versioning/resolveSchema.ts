import { cloneDeep } from "lodash";
import { VersionedSchema } from "./";
import { applyChanges } from "./applyChanges";
import { compareVersions } from "./compareVersions";

export function resolveSchema(schemaType: VersionedSchema, formatVersion?: string | number) {
    const schema = cloneDeep(schemaType.baseSchema);

    if (!formatVersion || !schemaType.versionedChanges) {
        return schema;
    }

    for (const changeSet of schemaType.versionedChanges) {
        if (compareVersions(formatVersion, changeSet.version) >= 0) {
            applyChanges(schema, changeSet.changes);
        }
    }

    return schema;
}