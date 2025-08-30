import * as vscode from "vscode";
import { MinecraftProject } from "./MinecraftProject";

export class AddonProject extends MinecraftProject {
    get addonFolder() {
        return vscode.Uri.joinPath(this.folder, "addon");
    }
    get behaviorPackFolder() {
        return vscode.Uri.joinPath(this.addonFolder, "behavior_pack");
    }
    get resourcePackFolder() {
        return vscode.Uri.joinPath(this.addonFolder, "resource_pack");
    }
    get scriptsFolder() {
        return vscode.Uri.joinPath(this.addonFolder, "scripts");
    }
}