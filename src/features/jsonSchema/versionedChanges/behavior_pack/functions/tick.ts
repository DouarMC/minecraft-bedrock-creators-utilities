import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    description: "Ce fichier sert à executer en boucle des fonctions de commandes. \n Type : Object",
    type: "object",
    required: ["values"],
    properties: {
        values: {
            description: "Les chemins d'accès aux fonctions à executer en boucle. String[]",
            type: "array",
            items: {
                type: "string"
            }
        }
    }
};

export const tickSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/functions/tick.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};