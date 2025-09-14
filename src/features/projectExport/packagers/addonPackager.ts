import * as vscode from "vscode";
import { MinecraftProject } from "../../../core/project/MinecraftProject";
import { directoryExists } from "../../../core/filesystem/directories";
import { compileTypeScript } from "../../../core/project/generators/addon/scriptApi/compileTypeScript";
import { createArchive } from "../../../core/filesystem/createArchive";
import { createContentsJsonFile } from "../../../core/project/generators/addon/createContentsJsonFile";
import { createTexturesListFile } from "../../../core/project/generators/addon/createTexturesListFile";

export async function addonPackager(minecraftProject: MinecraftProject): Promise<void> {
    // Récupère les dossiers du Behavior Pack et du Resource Pack
    const behaviorPack = minecraftProject.behaviorPackFolder;
    const resourcePack = minecraftProject.resourcePackFolder;

    // Arrête le processus si le projet ne contient ni Behavior Pack, ni Resource Pack
    if (behaviorPack === undefined && resourcePack === undefined) {
        vscode.window.showErrorMessage("Le projet ne contient ni Behavior Pack, ni Resource Pack.");
        return;
    }

    // Crée le dossier d'export s'il n'existe pas
    const exportFolder = vscode.Uri.joinPath(minecraftProject.folder, "export");
    if (await directoryExists(exportFolder) === false) {
        await vscode.workspace.fs.createDirectory(exportFolder);
    }

    // Gestion du Behavior Pack
    if (behaviorPack !== undefined && await directoryExists(behaviorPack)) {
        // Compile les scripts TypeScript avant le packaging s'il y en a
        const compilantionNoError = await compileTypeScript(minecraftProject);
        if (compilantionNoError === false) {
            vscode.window.showErrorMessage("❌ Le packaging a été annulé en raison d'erreurs de compilation.");
            return;
        }

        // Crée le fichier contents.json s'il n'existe pas
        await createContentsJsonFile(behaviorPack);

        // Crée le fichier .mcpack du Behavior Pack
        const behaviorPackName = `${minecraftProject.id}_bp.mcpack`;
        const behaviorPackExportPath = vscode.Uri.joinPath(exportFolder, behaviorPackName);
        await createArchive(
            [{source: behaviorPack, metadataPath: ""}],
            behaviorPackExportPath
        );
    }

    if (resourcePack !== undefined && await directoryExists(resourcePack)) {
        // Crée le fichier textures_list.json
        await createTexturesListFile(resourcePack);
        // Crée le fichier contents.json s'il n'existe pas
        await createContentsJsonFile(resourcePack);

        // Crée le fichier .mcpack du Resource Pack
        const resourcePackName = `${minecraftProject.id}_rp.mcpack`;
        const resourcePackExportPath = vscode.Uri.joinPath(exportFolder, resourcePackName);
        await createArchive(
            [{source: resourcePack, metadataPath: ""}],
            resourcePackExportPath
        );
    }

    // Crée le fichier .mcaddon si le projet contient à la fois un Behavior Pack et un Resource Pack
    const entries = [];
    if (behaviorPack !== undefined && await directoryExists(behaviorPack)) {
        entries.push({source: behaviorPack, metadataPath: `${minecraftProject.id}_bp`});
    }
    if (resourcePack !== undefined && await directoryExists(resourcePack)) {
        entries.push({source: resourcePack, metadataPath: `${minecraftProject.id}_rp`});
    }

    if (entries.length > 0) {
        const mcaddonName = `${minecraftProject.id}.mcaddon`;
        const mcaddonExportPath = vscode.Uri.joinPath(exportFolder, mcaddonName);

        await createArchive(entries, mcaddonExportPath);

        vscode.window.showInformationMessage(`✅ Export terminé : ${mcaddonExportPath.fsPath}`);
    }
}