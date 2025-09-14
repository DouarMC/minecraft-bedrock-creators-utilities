import * as vscode from "vscode";
import { MinecraftProjectConfig, MinecraftProjectType } from "../../types/projectConfig";
import { loadMinecraftProjectConfig } from "./config/loadMinecraftProjectConfig";
import { MinecraftProjectFileResolver } from "./MinecraftProjectFileResolver";

export class MinecraftProject {
    folder: vscode.Uri;
    config: MinecraftProjectConfig;
    fileResolver: MinecraftProjectFileResolver;

    constructor(projectFolder: vscode.Uri, config: MinecraftProjectConfig) {
        this.folder = projectFolder;
        this.config = config;
        this.fileResolver = new MinecraftProjectFileResolver(this);
    }

    static async load(): Promise<MinecraftProject | undefined> {
        const folder = vscode.workspace.workspaceFolders?.[0]?.uri;
        if (!folder) return undefined;
        const projectConfig = await loadMinecraftProjectConfig(folder);
        if (!projectConfig) return undefined;

        return new MinecraftProject(folder, projectConfig);
    }

    get configFileUri() {
        return vscode.Uri.joinPath(this.folder, ".mcbe_project.json");
    }

    get id() {
        return this.config.metadata.id;
    }

    get minecraftProduct() {
        return this.config.metadata.minecraftProduct;
    }

    get options() {
        return this.config.options;
    }

    get type() {
        return this.config.metadata.type;
    }

    get addonFolder() {
        if (this.type !== MinecraftProjectType.Addon) {
            return undefined;
        }

        return vscode.Uri.joinPath(this.folder, "addon");
    }

    private getAddonSubFolder(name: string): vscode.Uri | undefined {
        if (this.type !== MinecraftProjectType.Addon) {
            return undefined;
        }
        return vscode.Uri.joinPath(this.addonFolder!, name);
    }

    get behaviorPackFolder() {
        return this.getAddonSubFolder("behavior_pack");
    }

    get resourcePackFolder() {
        return this.getAddonSubFolder("resource_pack");
    }

    get scriptsFolder() {
        return this.getAddonSubFolder("scripts");
    }

    async getPackageJsonFile(): Promise<vscode.Uri | undefined> {
        const packageJsonUri = vscode.Uri.joinPath(this.folder, "package.json");
        
        try {
            const fileStat = await vscode.workspace.fs.stat(packageJsonUri);
            if (fileStat.type === vscode.FileType.File) {
                return packageJsonUri;
            }
        } catch {
            return undefined;
        }
    }
}