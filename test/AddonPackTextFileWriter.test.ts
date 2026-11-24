import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { describe, it } from "node:test";
import { AddonPackTextFileWriter, AddonPackTextFileWriterDependencies } from "../src/services/projects/AddonPackTextFileWriter";
import { ProjectMetadata } from "../src/types/projectConfig";

const metadata: ProjectMetadata = {
    type: "addon",
    id: "test-addon",
    displayName: "Test Add-on",
    author: "Test Author",
    minecraftProduct: "stable"
};

function createFileSystemDependencies(): AddonPackTextFileWriterDependencies<string> {
    return {
        joinPath: (base, ...segments) => path.join(base, ...segments),
        createDirectory: (directory) => mkdir(directory).then(() => undefined),
        isDirectoryAlreadyExists: (error) =>
            error instanceof Error && "code" in error && error.code === "EEXIST",
        writeFile: (file, content) => writeFile(file, content, "utf8")
    };
}

describe("AddonPackTextFileWriter", () => {
    it("reuses an existing texts directory and writes behavior pack language files", async () => {
        const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "addon-pack-texts-"));
        try {
            const packFolder = path.join(temporaryDirectory, "behavior_pack");
            const textsFolder = path.join(packFolder, "texts");
            await mkdir(textsFolder, { recursive: true });
            await writeFile(path.join(textsFolder, "existing.txt"), "keep");

            await AddonPackTextFileWriter.create(packFolder, metadata, "behavior_pack", createFileSystemDependencies());

            assert.deepEqual(JSON.parse(await readFile(path.join(textsFolder, "languages.json"), "utf8")), ["en_US"]);
            assert.equal(
                await readFile(path.join(textsFolder, "en_US.lang"), "utf8"),
                "pack.name=Test Add-on BP [v0.0.1] - by Test Author\npack.description=Pack for Test Add-on - Created by Test Author"
            );
            assert.equal(await readFile(path.join(textsFolder, "existing.txt"), "utf8"), "keep");
        } finally {
            await rm(temporaryDirectory, { recursive: true, force: true });
        }
    });

    it("creates a texts directory and writes resource pack language files", async () => {
        const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "addon-pack-texts-"));
        try {
            const packFolder = path.join(temporaryDirectory, "resource_pack");
            await mkdir(packFolder);

            await AddonPackTextFileWriter.create(packFolder, metadata, "resource_pack", createFileSystemDependencies());

            assert.deepEqual(
                JSON.parse(await readFile(path.join(packFolder, "texts", "languages.json"), "utf8")),
                ["en_US"]
            );
            assert.match(
                await readFile(path.join(packFolder, "texts", "en_US.lang"), "utf8"),
                /Test Add-on RP/
            );
        } finally {
            await rm(temporaryDirectory, { recursive: true, force: true });
        }
    });
});
