/**
 * Ajoute les dépendances mutuelles entre Behavior Pack et Resource Pack
 * et configure le scope si nécessaire.
 */
export function configurePackDependencies(behaviorManifest?: any, resourceManifest?: any): void {
    if (behaviorManifest && resourceManifest) {
        behaviorManifest.dependencies = behaviorManifest.dependencies ?? [];
        resourceManifest.dependencies = resourceManifest.dependencies ?? [];

        behaviorManifest.dependencies.push({
            uuid: resourceManifest.header.uuid,
            version: resourceManifest.header.version
        });

        resourceManifest.dependencies.push({
            uuid: behaviorManifest.header.uuid,
            version: behaviorManifest.header.version
        });

        resourceManifest.header.pack_scope = "world";
    } else if (resourceManifest) {
        resourceManifest.header.pack_scope = "any";
    }
}