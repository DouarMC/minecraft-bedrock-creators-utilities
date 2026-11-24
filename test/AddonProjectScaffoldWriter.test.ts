import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { describe, it } from "node:test";
import { AddonProjectScaffoldDependencies, AddonProjectScaffoldWriter } from "../src/services/projects/AddonProjectScaffoldWriter";
import { AddonStructureOptions } from "../src/types/addonProjectSetup";
import { ProjectMetadata } from "../src/types/projectConfig";

const metadata: ProjectMetadata = {
    type: "addon",
    id: "test-addon",
    displayName: "Test Add-on",
    author: "Test Author",
    minecraftProduct: "stable"
};

function createFileSystemDependencies(): AddonProjectScaffoldDependencies<string> {
    return {
        joinPath: (base, ...segments) => path.join(base, ...segments),
        createDirectory: async (directory) => {
            await mkdir(directory, { recursive: true });
        },
        isFileExistsError: (error) =>
            error instanceof Error && "code" in error && error.code === "EEXIST",
        copyDefaultPackIcon: async (packFolder) => {
            await writeFile(path.join(packFolder, "pack_icon.png"), "default icon");
        },
        writeFile: async (file, content) => {
            await writeFile(file, content, "utf8");
        },
        createScriptApiStructure: async (projectFolder) => {
            const scriptsFolder = path.join(projectFolder, "addon", "scripts");
            await mkdir(scriptsFolder, { recursive: true });
            await writeFile(path.join(scriptsFolder, "main.ts"), "export {};", "utf8");
        },
        installNpmDependencies: async () => undefined
    };
}

describe("AddonProjectScaffoldWriter", () => {
    it("creates selected packs and writes their manifests and supporting files", async () => {
        const projectFolder = await mkdtemp(path.join(tmpdir(), "addon-project-scaffold-"));
        try {
            const options: AddonStructureOptions = {
                packTypes: ["behavior_pack", "resource_pack"],
                behaviorPackModuleTypes: ["data", "script"],
                scriptApiModules: {
                    "@minecraft/server": { version: "1.0.0", npmVersion: "^1.0.0" }
                }
            };

            await AddonProjectScaffoldWriter.create(
                projectFolder,
                metadata,
                options,
                createFileSystemDependencies()
            );

            const behaviorPackFolder = path.join(projectFolder, "addon", "behavior_pack");
            const resourcePackFolder = path.join(projectFolder, "addon", "resource_pack");
            const behaviorManifest = JSON.parse(await readFile(path.join(behaviorPackFolder, "manifest.json"), "utf8"));
            const resourceManifest = JSON.parse(await readFile(path.join(resourcePackFolder, "manifest.json"), "utf8"));
            const packageJson = JSON.parse(await readFile(path.join(projectFolder, "package.json"), "utf8"));

            assert.deepEqual(behaviorManifest.modules.map((module: any) => module.type), ["data", "script"]);
            assert.ok(behaviorManifest.dependencies.some((dependency: any) => dependency.module_name === "@minecraft/server"));
            assert.ok(behaviorManifest.dependencies.some((dependency: any) => dependency.uuid === resourceManifest.header.uuid));
            assert.deepEqual(resourceManifest.dependencies, [{
                uuid: behaviorManifest.header.uuid,
                version: behaviorManifest.header.version
            }]);
            assert.equal(resourceManifest.header.pack_scope, "world");
            assert.equal(packageJson.dependencies["@minecraft/server"], "^1.0.0");
            assert.equal(packageJson.devDependencies.typescript, "^5.8.3");
            assert.equal(
                await readFile(path.join(behaviorPackFolder, "texts", "en_US.lang"), "utf8"),
                "pack.name=Test Add-on BP [v0.0.1] - by Test Author\npack.description=Pack for Test Add-on - Created by Test Author"
            );
            assert.equal(
                await readFile(path.join(resourcePackFolder, "texts", "en_US.lang"), "utf8"),
                "pack.name=Test Add-on RP [v0.0.1] - by Test Author\npack.description=Pack for Test Add-on - Created by Test Author"
            );
            assert.equal(await readFile(path.join(behaviorPackFolder, "pack_icon.png"), "utf8"), "default icon");
            assert.equal(await readFile(path.join(resourcePackFolder, "pack_icon.png"), "utf8"), "default icon");
            assert.equal(await readFile(path.join(projectFolder, "addon", "scripts", "main.ts"), "utf8"), "export {};");
        } finally {
            await rm(projectFolder, { recursive: true, force: true });
        }
    });
});
