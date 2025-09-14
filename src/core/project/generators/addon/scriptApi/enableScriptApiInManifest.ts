import { randomUUID } from "crypto";

export function enableScriptApiInManifest(behaviorManifest: any): void {
    const hasScriptModule = behaviorManifest.modules.some((module: any) => module.type === "script");
    if (hasScriptModule) {
        return;
    }

    behaviorManifest.modules = behaviorManifest.modules || [];
    behaviorManifest.modules.push({
        type: "script",
        uuid: randomUUID(),
        version: [0, 0, 1],
        language: "javascript",
        entry: "scripts/main.js"
    });
}