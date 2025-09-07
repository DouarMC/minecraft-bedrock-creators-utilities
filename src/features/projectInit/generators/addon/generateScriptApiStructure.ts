import * as vscode from "vscode";
import { randomUUID } from "crypto";

/**
 * Ajoute le bloc `script` au manifest et génère les fichiers
 * nécessaires à l'API Script (main.ts, tsconfig.json, types/).
 */
export async function generateScriptApiStructure(
    projectFolder: vscode.Uri,
    behaviorManifest: any,
    npmDependencies: Record<string, string>
): Promise<void> {
    behaviorManifest.modules.push({
        type: "script",
        uuid: randomUUID(),
        version: [0, 0, 1],
        language: "javascript",
        entry: "scripts/main.js"
    });

    // Crée le dossier scripts et main.ts
    const scriptsPath = vscode.Uri.joinPath(projectFolder, "addon", "scripts");
    await vscode.workspace.fs.createDirectory(scriptsPath);

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(scriptsPath, "main.ts"),
        Buffer.from(`// Script principal\nconsole.warn("Hello from main.ts!");`, "utf8")
    );

    // Crée le fichier tsconfig.json
    const tsconfigContent = {
        compilerOptions: {
            target: "ES2020",
            module: "ESNext",
            moduleResolution: "Node",
            outDir: "addon/behavior_pack/scripts",
            rootDir: "addon/scripts",
            strict: true,
            allowJs: false,
            lib: ["ES2023"],
            types: ["minecraft-env"],
            typeRoots: ["./types"]
        },
        include: ["addon/scripts/**/*.ts"],
        exclude: ["node_modules"]
    };

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(projectFolder, "tsconfig.json"),
        Buffer.from(JSON.stringify(tsconfigContent, null, 4), "utf8")
    );

    // Crée le dossier types/minecraft-env
    const typesPath = vscode.Uri.joinPath(projectFolder, "types");
    await vscode.workspace.fs.createDirectory(typesPath);

    const minecraftEnvPath = vscode.Uri.joinPath(typesPath, "minecraft-env");
    await vscode.workspace.fs.createDirectory(minecraftEnvPath);

    const indexDtsContent =
        "/** Console Mojang (Minecraft QuickJS) */" +
        "\ninterface Console {" +
        "\n\tlog: (...args: any[]) => void;" +
        "\n\twarn: (...args: any[]) => void;" +
        "\n\terror: (...args: any[]) => void;" +
        "\n\tinfo: (...args: any[]) => void;" +
        "\n}" +
        "\n" +
        "\ndeclare const console: Console;" +
        "\n" +
        "\n/** Alias QuickJS/Minecraft de console.log */" +
        "\ndeclare function print(...args: any[]): void;";

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(minecraftEnvPath, "index.d.ts"),
        Buffer.from(indexDtsContent, "utf8")
    );
}