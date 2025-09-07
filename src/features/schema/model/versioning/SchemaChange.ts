import { SchemaModification } from "./SchemaModification";

/**
 * Ensemble de modifications appliquées à une version donnée.
 */
export interface SchemaChange {
    version: string | number; // ex: "1.21.60" ou 2 pour manifest.json
    changes: SchemaModification[];
}