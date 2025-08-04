import { SchemaType } from "../../../types/schema";

import { entitySchemaTypeBP } from "../versionedChanges/behavior_pack/entities/_entity";
import { blockSchemaTypeBP } from "../versionedChanges/behavior_pack/blocks/_block";
import { testSchemaType } from "../versionedChanges/behavior_pack/test";

export const ALL_SCHEMAS: SchemaType[] = [
    blockSchemaTypeBP,
    entitySchemaTypeBP,
    testSchemaType,
    // Ajouter d'autres schémas ici
];