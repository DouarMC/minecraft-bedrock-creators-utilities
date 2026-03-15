import { MinecraftProject } from "./MinecraftProject";
import * as path from "path";

export class AddonMinecraftProject extends MinecraftProject {
    public getAddonPath(): string {
        return path.join(this.folder, "addon");
    }

    public getBehaviorPackPath(): string {
        return path.join(this.getAddonPath(), "behavior_pack");
    }

    public getResourcePackPath(): string {
        return path.join(this.getAddonPath(), "resource_pack");
    }

    public getScriptsPath(): string {
        return path.join(this.getAddonPath(), "scripts");   
    }
}