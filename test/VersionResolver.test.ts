import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VersionedSchema } from "../common/types/VersionedSchema";
import { VersionResolver } from "../src/core/minecraft/versioning/VersionResolver";

describe("VersionResolver", () => {
    it("compares version components numerically", () => {
        assert.equal(VersionResolver.compare("1.10.0", "1.2.0"), 1);
        assert.equal(VersionResolver.compare("1.2", "1.2.0"), 0);
    });

    it("orders beta after numeric versions", () => {
        assert.equal(VersionResolver.compare("beta", "1.99.0"), 1);
        assert.equal(VersionResolver.compare("1.99.0", "beta"), -1);
    });

    it("applies only changes supported by the requested format version", () => {
        const versionedSchema: VersionedSchema = {
            baseSchema: {
                type: "object",
                properties: {
                    existing: { type: "string" },
                    removed: { type: "boolean" },
                    "minecraft:movement.jump": {
                        type: "object",
                        properties: {
                            jump_delay: { type: "number" }
                        }
                    }
                }
            },
            versionedChanges: [
                {
                    version: "1.2.0",
                    changes: [
                        { target: ["properties", "existing", "type"], action: "modify", value: "integer" },
                        { target: ["properties", "added"], action: "add", value: { type: "number" } },
                        { target: ["properties", "removed"], action: "remove" },
                        {
                            target: ["properties", "minecraft:movement.jump", "properties", "jump_delay", "type"],
                            action: "modify",
                            value: "integer"
                        }
                    ]
                },
                {
                    version: "1.4.0",
                    changes: [
                        { target: ["properties", "future"], action: "add", value: { type: "string" } }
                    ]
                }
            ]
        };

        const resolved = VersionResolver.resolve(versionedSchema, "1.3.0");

        assert.deepEqual(resolved.properties, {
            existing: { type: "integer" },
            added: { type: "number" },
            "minecraft:movement.jump": {
                type: "object",
                properties: {
                    jump_delay: { type: "integer" }
                }
            }
        });
        assert.deepEqual(versionedSchema.baseSchema.properties, {
            existing: { type: "string" },
            removed: { type: "boolean" },
            "minecraft:movement.jump": {
                type: "object",
                properties: {
                    jump_delay: { type: "number" }
                }
            }
        });
    });
});
