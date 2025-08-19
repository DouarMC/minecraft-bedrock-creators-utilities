import { JSONPath, Node as JsonNode, getNodeValue } from "jsonc-parser";
import { resolveOneOfBranch } from "./resolveOneOfBranch";

export function navigateToSchemaAtPath(baseSchema: any, path: JSONPath, node: JsonNode | undefined, navigateFor: "completion" | "hover"): any {
    let currentSchema = baseSchema;
    let currentNode = node;

    if (navigateFor === "completion") {
        if (currentSchema?.oneOf !== undefined && currentSchema?.oneOf.length > 0) {
            const brancheSchemas = resolveOneOfBranch(currentSchema.oneOf, currentNode);
            if (brancheSchemas.length === 1) {
                currentSchema = brancheSchemas[0];
            } else {
                // On garde le schéma courant pour la complétion
                return currentSchema;
            }
        }
        for (const segment of path) {
            if (typeof segment === "string") {
                if (currentSchema?.properties !== undefined && currentSchema?.additionalProperties !== undefined) {
                    const propertyName = segment;
                    if (currentSchema.properties[propertyName]) {
                        currentSchema = currentSchema.properties[propertyName];
                    } else if (typeof currentSchema.additionalProperties === "object") {
                        currentSchema = currentSchema.additionalProperties;
                    }
                } else if (currentSchema?.properties !== undefined) {
                    currentSchema = currentSchema.properties[segment];
                } else if (currentSchema?.additionalProperties !== undefined) {
                    currentSchema = currentSchema.additionalProperties;
                }

                if (currentNode?.type === "object" && currentNode?.children) {
                    for (const child of currentNode.children) {
                        if (child.type === "property") {
                            if (child?.children && child.children[0]?.value === segment) {
                                currentNode = child.children[1];
                                break;
                            }
                        }
                    }
                }
            } else if (typeof segment === "number") {
                if (currentSchema?.items) {
                    if (Array.isArray(currentSchema.items)) {
                        const index = segment;
                        if (!isNaN(index) && currentSchema.items[index]) {
                            currentSchema = currentSchema.items[index];
                        } else {
                            // Par défaut, rien
                            return null;
                        }
                    } else {
                        currentSchema = currentSchema.items;
                    }
                }

                if (currentNode?.type === "array" && currentNode?.children) {
                    if (currentNode.children[segment]) {
                        currentNode = currentNode.children[segment];
                    } else {
                        return null; // Si l'index n'existe pas, on arrête la navigation
                    }
                }
            }

            if (currentSchema?.oneOf !== undefined && currentSchema?.oneOf.length > 0) {
                const brancheSchemas = resolveOneOfBranch(currentSchema.oneOf, currentNode);
                if (brancheSchemas.length === 1) {
                    currentSchema = brancheSchemas[0];
                } else {
                    // On garde le schéma courant pour la complétion
                    return currentSchema;
                }
            }
            
            if (!currentSchema) {
                return null;
            }
        }
    } else if (navigateFor === "hover") {
        if (currentSchema?.oneOf !== undefined && currentSchema?.oneOf.length > 0) {
            const brancheSchemas = resolveOneOfBranch(currentSchema.oneOf, currentNode);
            if (brancheSchemas.length === 1) {
                currentSchema = brancheSchemas[0];
            } else {
                // On garde le schéma courant pour la complétion
            }
        }

        for (const segment of path) {
            if (currentSchema?.oneOf !== undefined && currentSchema?.oneOf.length > 0) {
                const brancheSchemas = resolveOneOfBranch(currentSchema.oneOf, currentNode);

                if (brancheSchemas.length === 1) {
                    currentSchema = brancheSchemas[0];
                } else {
                    // On garde le schéma courant pour la complétion
                }
            }

            if (typeof segment === "string") {
                if (currentSchema?.properties !== undefined && currentSchema?.additionalProperties !== undefined) {
                    const propertyName = segment;
                    if (currentSchema.properties[propertyName]) {
                        currentSchema = currentSchema.properties[propertyName];
                    } else if (typeof currentSchema.additionalProperties === "object") {
                        currentSchema = currentSchema.additionalProperties;
                    }
                } else if (currentSchema?.properties !== undefined) {
                    currentSchema = currentSchema.properties[segment];
                } else if (currentSchema?.additionalProperties !== undefined) {
                    currentSchema = currentSchema.additionalProperties;
                }

                if (currentNode?.type === "object" && currentNode?.children) {
                    for (const child of currentNode.children) {
                        if (child.type === "property") {
                            if (child?.children && child.children[0]?.value === segment) {
                                currentNode = child.children[1];
                                break;
                            }
                        }
                    }
                }
            } else if (typeof segment === "number") {
                if (currentSchema?.items) {
                    if (Array.isArray(currentSchema.items)) {
                        const index = segment;
                        if (!isNaN(index) && currentSchema.items[index]) {
                            currentSchema = currentSchema.items[index];
                        } else {
                            // Par défaut, rien
                            return null;
                        }
                    } else {
                        currentSchema = currentSchema.items;
                    }
                }

                if (currentNode?.type === "array" && currentNode?.children) {
                    if (currentNode.children[segment]) {
                        currentNode = currentNode.children[segment];
                    } else {
                        return null; // Si l'index n'existe pas, on arrête la navigation
                    }
                }
            }
            
            if (!currentSchema) {
                return null;
            }
        }
    }
    
    return currentSchema;
}