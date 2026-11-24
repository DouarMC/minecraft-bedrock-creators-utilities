import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AddonManifestFactory } from "../src/services/projects/AddonManifestFactory";
import { ProjectMetadata } from "../src/types/projectConfig";

const metadata: ProjectMetadata = {
    type: "addon",
    id: "test-addon",
    displayName: "Test Add-on",
    author: "Test Author",
    minecraftProduct: "stable"
};

describe("AddonManifestFactory", () => {
    it("creates package metadata for the project", () => {
        assert.deepEqual(AddonManifestFactory.createPackageJson(metadata), {
            name: "test-addon",
            version: "0.0.1",
            description: "Package for Test Add-on project.",
            license: "MIT",
            dependencies: {},
            type: "module"
        });
    });

    it("declares a local TypeScript compiler for Script API projects", () => {
        const packageJson = AddonManifestFactory.createPackageJson(metadata, true);

        assert.deepEqual(packageJson.devDependencies, { typescript: "^5.8.3" });
    });

    it("creates selected behavior modules, including the Script API entry point", () => {
        const manifest = AddonManifestFactory.createBehaviorPackManifest(["data", "script", "script"]);
        const scriptModule = manifest.modules.find((module: any) => module.type === "script");

        assert.equal(manifest.format_version, 2);
        assert.deepEqual(manifest.modules.map((module: any) => module.type), ["data", "script"]);
        assert.equal(scriptModule.language, "javascript");
        assert.equal(scriptModule.entry, "scripts/main.js");
    });

    it("does not add cross-pack dependencies to a behavior-only project", () => {
        const behaviorManifest = AddonManifestFactory.createBehaviorPackManifest(["data"]);

        AddonManifestFactory.configurePackDependencies(behaviorManifest, undefined);

        assert.equal(behaviorManifest.dependencies, undefined);
    });

    it("sets resource-only packs to a world-independent scope", () => {
        const resourceManifest = AddonManifestFactory.createResourcePackManifest();

        AddonManifestFactory.configurePackDependencies(undefined, resourceManifest);

        assert.equal(resourceManifest.header.pack_scope, "any");
        assert.equal(resourceManifest.dependencies, undefined);
    });

    it("links behavior and resource packs in both manifests", () => {
        const behaviorManifest = AddonManifestFactory.createBehaviorPackManifest(["data"]);
        const resourceManifest = AddonManifestFactory.createResourcePackManifest();

        AddonManifestFactory.configurePackDependencies(behaviorManifest, resourceManifest);

        assert.deepEqual(behaviorManifest.dependencies, [{
            uuid: resourceManifest.header.uuid,
            version: resourceManifest.header.version
        }]);
        assert.deepEqual(resourceManifest.dependencies, [{
            uuid: behaviorManifest.header.uuid,
            version: behaviorManifest.header.version
        }]);
        assert.equal(resourceManifest.header.pack_scope, "world");
    });

    it("adds Script API manifest and npm dependencies without duplicating manifest entries", () => {
        const behaviorManifest = {
            dependencies: [{ module_name: "@minecraft/server", version: "1.0.0" }]
        };
        const packageJson = {
            dependencies: { "@minecraft/server": "^1.0.0" }
        };

        AddonManifestFactory.addScriptApiModules(behaviorManifest, packageJson, {
            "@minecraft/server": { version: "2.0.0", npmVersion: "^2.0.0" },
            "@minecraft/server-ui": { version: "1.0.0", npmVersion: "^1.0.0" }
        });

        assert.deepEqual(behaviorManifest.dependencies, [
            { module_name: "@minecraft/server", version: "1.0.0" },
            { module_name: "@minecraft/server-ui", version: "1.0.0" }
        ]);
        assert.deepEqual(packageJson.dependencies, {
            "@minecraft/server": "^2.0.0",
            "@minecraft/server-ui": "^1.0.0"
        });
    });
});
