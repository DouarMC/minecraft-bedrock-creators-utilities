import { MinecraftProduct } from "../../../types/projectConfig";

type minecraftModulePackage =
    | "@minecraft/server"
    | "@minecraft/server-ui"
    | "@minecraft/server-admin"
    | "@minecraft/server-net"
    | "@minecraft/server-gametest"
    | "@minecraft/server-editor"
    | "@minecraft/diagnostics"
    | "@minecraft/debug-utilities";

export class ScriptModulesUtils {
    static async fetchAndFilterVersions(moduleName: minecraftModulePackage, minecraftProduct: MinecraftProduct): Promise<string[]> {
        const fullRegistryUrl = `https://registry.npmjs.org/${moduleName}`;
        const distTagsUrl = `https://registry.npmjs.org/-/package/${moduleName}/dist-tags`;

        try {
            // Récupération des tags (latest, beta, rc, etc.)
            const tagsResponse = await fetch(distTagsUrl);
            if (! tagsResponse.ok) throw new Error(`Erreur tags: ${tagsResponse.status} ${tagsResponse.statusText}`);
            const distTags = await tagsResponse.json();

            // Récupération de toutes les métadonnées (pour l'historique complet)
            const fullResponse = await fetch(fullRegistryUrl);
            if (!fullResponse.ok) throw new Error(`Erreur métadonnées: ${fullResponse.status} ${fullResponse.statusText}`);
            const metadata = await fullResponse.json();

            // Liste de toutes les versions (clés de l'objet metadata.versions)
            const allVersions: string[] = Object.keys(metadata.versions);

            // Versions de développement à inclure en fonction du mode
            let devVersions: string[] = [];

            if (minecraftProduct === "stable") {
                // Inclure la dernière version beta (si elle existe)
                if (distTags.beta && !devVersions.includes(distTags.beta)) {
                    devVersions.push(distTags.beta);
                }
            }
        }
    }
}