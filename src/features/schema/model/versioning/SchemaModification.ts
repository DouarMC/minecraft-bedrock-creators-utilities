import { PropertyPath } from "lodash";

/**
 * Décrit une opération appliquée à un schéma :
 * - add : ajout d'une propriété
 * - remove : suppression
 * - modify : modification
 */
export interface SchemaModification {
    target: PropertyPath;
    action: "add" | "remove" | "modify";
    value?: any;
    notes?: string;
}