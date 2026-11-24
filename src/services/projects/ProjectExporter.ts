import * as vscode from 'vscode';
import { AddonMinecraftProject } from '../../core/minecraft/models/projects/AddonMinecraftProject';
import { MinecraftProject } from '../../core/minecraft/models/projects/MinecraftProject';
import { FileSystemUtils } from '../../vscode-utils/FileSystemUtils';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';
import { ProjectOutputPreparer } from './ProjectOutputPreparer';

export class ProjectExporter {
    public static async exportProject(minecraftProject: MinecraftProject): Promise<void> {
        try {
            await ProjectOutputPreparer.prepareProjectForOutput(minecraftProject);
        } catch (error: any) {
            throw new Error(`Échec de la préparation du projet pour l'exportation : ${error.message}`);
        }

        if (minecraftProject instanceof AddonMinecraftProject) {
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath()))) {
                    behaviorPack = VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath());
                }
            } catch (error) {
                console.log("Il n'y a pas de Behavior Pack à exporter.", error);
            }
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath()))) {
                    resourcePack = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
                }
            } catch (error) {
                console.log("Il n'y a pas de Resource Pack à exporter.", error);
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à exporter.");
            }

            const exportFolder = VscodeUtils.getUriFromPath(minecraftProject.folder + "/export");
            if (!await VscodeUtils.pathExists(exportFolder)) {
                await vscode.workspace.fs.createDirectory(exportFolder);
            }

            if (behaviorPack) {
                const behaviorPackName = `${minecraftProject.id}_bp.mcpack`;
                const behaviorPackExportPath = vscode.Uri.joinPath(exportFolder, behaviorPackName);
                await FileSystemUtils.createArchive(
                    [{ source: behaviorPack, metadataPath: "" }],
                    behaviorPackExportPath
                );
            }

            if (resourcePack) {
                const resourcePackName = `${minecraftProject.id}_rp.mcpack`;
                const resourcePackExportPath = vscode.Uri.joinPath(exportFolder, resourcePackName);
                await FileSystemUtils.createArchive(
                    [{ source: resourcePack, metadataPath: "" }],
                    resourcePackExportPath
                );
            }

            const entries = [];
            if (behaviorPack) {
                entries.push({ source: behaviorPack, metadataPath: `${minecraftProject.id}_bp` });
            }
            if (resourcePack) {
                entries.push({ source: resourcePack, metadataPath: `${minecraftProject.id}_rp` });
            }

            if (entries.length > 0) {
                const mcaddonName = `${minecraftProject.id}.mcaddon`;
                const mcaddonExportPath = vscode.Uri.joinPath(exportFolder, mcaddonName);
                await FileSystemUtils.createArchive(
                    entries,
                    mcaddonExportPath
                );
            }
        }
    }
}
