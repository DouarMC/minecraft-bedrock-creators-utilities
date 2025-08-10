import { Node as JsonNode } from "jsonc-parser";
import { validateNode } from "../diagnostics/validateNode";
import { NodeValidationError, ERROR_WEIGHTS } from "../diagnostics/validateNode";

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

    // 2) Aucune valide ⇒ on choisit la/les plus proches
    type Scored = { schema: any; score: number };
    const scored: Scored[] = oneOfSchemas.map(schema => {
        const errors = validateNode(node, schema);
        return { schema, score: scoreErrors(errors) };
    });

    const minScore = Math.min(...scored.map(s => s.score));
    const best = scored.filter(s => s.score === minScore).map(s => s.schema);

    // 3) Si on n’a vraiment rien (très improbable), fallback sur toutes
    return best.length > 0 ? best : oneOfSchemas;
}