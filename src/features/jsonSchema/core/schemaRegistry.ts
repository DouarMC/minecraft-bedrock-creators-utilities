import { SchemaType } from "../../../types/schema";

import { entitySchemaTypeBP } from "../versionedChanges/behavior_pack/entities/_entity";
import { blockSchemaTypeBP } from "../versionedChanges/behavior_pack/blocks/_block";

export const ALL_SCHEMAS: SchemaType[] = [
    blockSchemaTypeBP,
    // Ajouter d'autres schémas ici
];