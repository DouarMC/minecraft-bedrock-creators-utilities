import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AddonSetupPrompts, collectAddonSetupOptions } from "../src/features/projectInit/AddonSetupPromptFlow";

function createPrompts(overrides: Partial<AddonSetupPrompts> = {}): AddonSetupPrompts {
    return {
        askAddonPackTypes: async () => [],
        askBehaviorPackModuleTypes: async () => [],
        askScriptApiModules: async () => undefined,
        ...overrides
    };
}

describe("collectAddonSetupOptions", () => {
    it("stops when no pack types are selected", async () => {
        let askedForBehaviorPackModules = false;
        const result = await collectAddonSetupOptions("stable", createPrompts({
            askBehaviorPackModuleTypes: async () => {
                askedForBehaviorPackModules = true;
                return ["data"];
            }
        }));

        assert.deepEqual(result, { status: "cancelled", reason: "pack-types" });
        assert.equal(askedForBehaviorPackModules, false);
    });

    it("stops when no behavior pack modules are selected", async () => {
        let askedForScriptApiModules = false;
        const result = await collectAddonSetupOptions("stable", createPrompts({
            askAddonPackTypes: async () => ["behavior_pack"],
            askScriptApiModules: async () => {
                askedForScriptApiModules = true;
                return undefined;
            }
        }));

        assert.deepEqual(result, { status: "cancelled", reason: "behavior-pack-module-types" });
        assert.equal(askedForScriptApiModules, false);
    });

    it("does not ask for behavior modules when only a resource pack is selected", async () => {
        let askedForBehaviorPackModules = false;
        const result = await collectAddonSetupOptions("stable", createPrompts({
            askAddonPackTypes: async () => ["resource_pack"],
            askBehaviorPackModuleTypes: async () => {
                askedForBehaviorPackModules = true;
                return ["data"];
            }
        }));

        assert.deepEqual(result, {
            status: "ready",
            options: {
                packTypes: ["resource_pack"],
                behaviorPackModuleTypes: [],
                scriptApiModules: undefined
            }
        });
        assert.equal(askedForBehaviorPackModules, false);
    });

    it("allows creating a script project without optional API dependencies", async () => {
        const result = await collectAddonSetupOptions("preview", createPrompts({
            askAddonPackTypes: async () => ["behavior_pack"],
            askBehaviorPackModuleTypes: async () => ["script"]
        }));

        assert.deepEqual(result, {
            status: "ready",
            options: {
                packTypes: ["behavior_pack"],
                behaviorPackModuleTypes: ["script"],
                scriptApiModules: undefined
            }
        });
    });
});
