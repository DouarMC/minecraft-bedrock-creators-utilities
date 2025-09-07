import { cloneDeep, set, unset} from 'lodash';

/**
 * Applique une liste de changements au schéma
 */
export function applyChanges(schema: any, changes: any[]): void {
    for (const change of changes) {
        switch (change.action) {
            case "add":
            case "modify":
                const value = cloneDeep(change.value); // ⬅️ éviter toute fuite de référence
                set(schema, change.target, value);
                break;
            case "remove":
                unset(schema, change.target);
                break;
            default:
                console.warn(`Unknown change action: ${change.action}`);
        }
    }
}