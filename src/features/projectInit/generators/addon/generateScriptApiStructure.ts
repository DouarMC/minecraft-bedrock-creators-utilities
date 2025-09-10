import * as vscode from "vscode";
import { randomUUID } from "crypto";
import { copyTemplateFile } from "../../../../core/filesystem/copyTemplateFile";

async function createMainTsFile(scriptsPath: vscode.Uri): Promise<void> {
    await copyTemplateFile("script-api/main.ts", vscode.Uri.joinPath(scriptsPath, "main.ts"));
}

async function createTsConfigFile(projectFolder: vscode.Uri): Promise<void> {
    await copyTemplateFile("script-api/tsconfig.template.json", vscode.Uri.joinPath(projectFolder, "tsconfig.json"));
}

async function createMinecraftEnvTypesFile(typesPath: vscode.Uri): Promise<void> {
    const minecraftEnvPath = vscode.Uri.joinPath(typesPath, "minecraft-env");
    await vscode.workspace.fs.createDirectory(minecraftEnvPath);
    await copyTemplateFile("script-api/types/minecraft-env/index.d.ts", vscode.Uri.joinPath(minecraftEnvPath, "index.d.ts"));
}

/**
 * Ajoute le bloc `script` au manifest et génère les fichiers
 * nécessaires à l'API Script (main.ts, tsconfig.json, types/).
 */
export async function generateScriptApiStructure(projectFolder: vscode.Uri, behaviorManifest: any): Promise<void> {
    // Ajoute le bloc `script` au manifeste dans les modules
    behaviorManifest.modules.push({
        type: "script",
        uuid: randomUUID(),
        version: [0, 0, 1],
        language: "javascript",
        entry: "scripts/main.js"
    });

    // Crée le dossier scripts
    const scriptsPath = vscode.Uri.joinPath(projectFolder, "addon", "scripts");
    await vscode.workspace.fs.createDirectory(scriptsPath);

    // Crée le fichier main.ts
    await createMainTsFile(scriptsPath);

    // Crée le fichier tsconfig.json
    await createTsConfigFile(projectFolder);

    // Crée le dossier types/minecraft-env
    const typesPath = vscode.Uri.joinPath(projectFolder, "types");
    await vscode.workspace.fs.createDirectory(typesPath);

    // Crée le fichier types/minecraft-env/index.d.ts
    await createMinecraftEnvTypesFile(typesPath);
}