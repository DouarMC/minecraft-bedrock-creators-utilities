import { Node as JsonNode } from "jsonc-parser";
import { validateNode } from "../diagnostics/validateNode";
import { NodeValidationError, ERROR_WEIGHTS } from "../diagnostics/validateNode";

type Scored = {
    schema: any;
    score: number;
}

function scoreErrors(errs: NodeValidationError[]): number {
    return errs.reduce((s, e) => s + (e.priority ?? ERROR_WEIGHTS.default), 0);
}

export function resolveOneOfBranch(oneOfSchemas: any[], node?: JsonNode): any[] {
    if (!Array.isArray(oneOfSchemas) || oneOfSchemas.length === 0) return [];
    if (!node) return oneOfSchemas;

    // 1) Branches strictement valides
    let validSchemas: any[] = [];
    for (const schema of oneOfSchemas) {
        const errors = validateNode(node, schema);
        if (errors.length === 0) validSchemas.push(schema);
    }
    if (validSchemas.length >= 1) return validSchemas;

    // 2) Branches avec erreurs -> on chosit celle qui ont le meme type que le noeud
    let validSchemasByType: any[] = [];
    for (const schema of oneOfSchemas) {
        const errors = validateNode(node, schema);
        const hasTypeError = errors.some(e => {
            return e.code === "type" && e.node === node;
        });
        if (!hasTypeError) {
            validSchemasByType.push(schema);
        }
    }
    if (validSchemasByType.length >= 1) {
        // 2.1 - Si une seule branche valide, on la renvoie
        if (validSchemasByType.length === 1) {
            return validSchemasByType;
        }
        // 2.2 - On a plusieurs branches valides car elles ont le meme type
        if (validSchemasByType.length > 1) {
            // On choisit la/les plus proches
            const scored: Scored[] = validSchemasByType.map(schema => {
                const errors = validateNode(node, schema).filter(e => e.node === node);
                return {
                    schema: schema,
                    score: scoreErrors(errors)
                };
            });

            const minScore = Math.min(...scored.map(s => s.score));
            const best = scored.filter(s => s.score === minScore).map(s => s.schema);

            // 3) Si on n’a vraiment rien (très improbable), fallback sur toutes
            return best.length > 0 ? best : oneOfSchemas;
        }
    }

    // 3) Aucune branche valide, on les renvoie toutes
    return oneOfSchemas;
}