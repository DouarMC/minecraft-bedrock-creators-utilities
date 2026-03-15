import { MinecraftPackType } from "./MinecraftTypes";
import { Manifest } from "./fileStructures/Manifest";

export class MinecraftPack {
    public readonly rootUri: string;
    public readonly manifest: Manifest;
    public readonly packType: MinecraftPackType;

    public constructor(
        rootUri: string,
        manifest: any,
        packType: MinecraftPackType
    ) {
        this.rootUri = rootUri;
        this.manifest = manifest;
        this.packType = packType;
    }

    /**
     * Détermine le type de pack Minecraft en fonction du manifeste.
     * @param manifest
     * @returns 
     */
    public static determinePackType(manifest: Manifest): MinecraftPackType | undefined {
        if (! manifest.modules || !Array.isArray(manifest.modules)) {
            return undefined;
        }

        if (manifest.modules.length === 1) {
            switch (manifest.modules[0].type) {
                case "data":
                case "script":
                    return "behavior_pack";
                case "resources":
                    return "resource_pack";
                case "skin_pack":
                    return "skin_pack";
                case "world_template":
                    return "world_template";
            }
        } else if (manifest.modules.length === 2) {
            const types = manifest.modules.map(module => module.type);

            if (types.includes("data") && types.includes("script")) {
                return "behavior_pack";
            }
        }

        return undefined;
    }
}